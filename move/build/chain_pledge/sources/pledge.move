module chain_pledge::pledge {
    use std::string::String;
    use std::signer;
    use std::table::{Self, Table};
    use aptos_framework::coin::{Self, Coin, withdraw, deposit, burn, transfer};
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_framework::aptos_coin::AptosCoin;

    // Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_NOT_CREATOR: u64 = 3;
    const E_PLEDGE_NOT_FOUND: u64 = 4;
    const E_PLEDGE_ALREADY_COMPLETED: u64 = 5;
    const E_INVALID_AMOUNT: u64 = 6;
    const E_INVALID_DEADLINE: u64 = 7;
    const E_DEADLINE_NOT_REACHED: u64 = 8;
    const E_DEADLINE_PASSED: u64 = 9;

    struct Pledge has store {
        creator: address,
        description: String,
        stake: u64,
        deadline: u64,
        completed: bool,
        coin: Coin<AptosCoin>,
    }

    struct PledgeStore has key {
        pledges: Table<address, Pledge>,
        pledge_created_events: EventHandle<PledgeCreatedEvent>,
        pledge_completed_events: EventHandle<PledgeCompletedEvent>,
        pledge_resolved_events: EventHandle<PledgeResolvedEvent>,
    }

    struct PledgeCreatedEvent has drop, store {
        creator: address,
        description: String,
        stake: u64,
        deadline: u64,
    }

    struct PledgeCompletedEvent has drop, store {
        creator: address,
    }

    struct PledgeResolvedEvent has drop, store {
        creator: address,
        resolved: bool,
        amount: u64,
    }

    struct PledgeView has copy, drop {
        creator: address,
        description: String,
        stake: u64,
        deadline: u64,
        completed: bool,
    }

    public entry fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);
        assert!(!exists<PledgeStore>(account_addr), E_ALREADY_INITIALIZED);

        move_to(account, PledgeStore {
            pledges: table::new(),
            pledge_created_events: account::new_event_handle<PledgeCreatedEvent>(account),
            pledge_completed_events: account::new_event_handle<PledgeCompletedEvent>(account),
            pledge_resolved_events: account::new_event_handle<PledgeResolvedEvent>(account),
        });
    }

    public entry fun create_pledge(
        account: &signer,
        description: String,
        stake: u64,
        deadline: u64
    ) acquires PledgeStore {
        assert!(stake > 0, E_INVALID_AMOUNT);
        assert!(deadline > timestamp::now_seconds(), E_INVALID_DEADLINE);

        let account_addr = signer::address_of(account);
        let pledge_store = borrow_global_mut<PledgeStore>(account_addr);

        // Withdraw stake from creator
        let coin = withdraw<AptosCoin>(account, stake);

        let pledge = Pledge {
            creator: account_addr,
            description,
            stake,
            deadline,
            completed: false,
            coin,
        };

        table::add(&mut pledge_store.pledges, account_addr, pledge);

        event::emit_event(
            &mut pledge_store.pledge_created_events,
            PledgeCreatedEvent {
                creator: account_addr,
                description,
                stake,
                deadline,
            }
        );
    }

    public entry fun mark_completed(account: &signer) acquires PledgeStore {
        let account_addr = signer::address_of(account);
        let pledge_store = borrow_global_mut<PledgeStore>(account_addr);
        assert!(table::contains(&pledge_store.pledges, account_addr), E_PLEDGE_NOT_FOUND);

        let pledge = table::borrow_mut(&mut pledge_store.pledges, account_addr);
        assert!(!pledge.completed, E_PLEDGE_ALREADY_COMPLETED);
        assert!(pledge.creator == account_addr, E_NOT_CREATOR);

        pledge.completed = true;

        event::emit_event(
            &mut pledge_store.pledge_completed_events,
            PledgeCompletedEvent {
                creator: account_addr,
            }
        );
    }

    public entry fun withdraw_or_burn(account: &signer) acquires PledgeStore {
        let account_addr = signer::address_of(account);
        let pledge_store = borrow_global_mut<PledgeStore>(account_addr);
        assert!(table::contains(&pledge_store.pledges, account_addr), E_PLEDGE_NOT_FOUND);

        let Pledge { creator, description, stake, deadline, completed, coin } = table::remove(&mut pledge_store.pledges, account_addr);
        assert!(timestamp::now_seconds() >= deadline, E_DEADLINE_NOT_REACHED);

        let amount = stake;
        let resolved = completed;

        if (resolved) {
            // Refund stake to creator
            deposit<AptosCoin>(account_addr, coin);
        } else {
            // Send stake to burn address
            deposit<AptosCoin>(@0xdead, coin);
        };

        event::emit_event(
            &mut pledge_store.pledge_resolved_events,
            PledgeResolvedEvent {
                creator: account_addr,
                resolved,
                amount,
            }
        );
    }

    public fun get_pledge(account: address): PledgeView acquires PledgeStore {
        let pledge_store = borrow_global<PledgeStore>(account);
        assert!(table::contains(&pledge_store.pledges, account), E_PLEDGE_NOT_FOUND);
        let pledge = table::borrow(&pledge_store.pledges, account);
        PledgeView {
            creator: pledge.creator,
            description: pledge.description,
            stake: pledge.stake,
            deadline: pledge.deadline,
            completed: pledge.completed,
        }
    }

    #[test_only]
    use aptos_framework::account::create_account_for_test;

    #[test(admin = @chain_pledge)]
    fun test_pledge_flow(admin: &signer) {
        let user = account::create_account_for_test(@0x123);
        let admin_addr = signer::address_of(admin);
        let user_addr = signer::address_of(&user);

        // Initialize contract
        initialize(admin);

        // Create pledge
        create_pledge(&user, b"Test pledge", 100, timestamp::now_seconds() + 3600);

        // Verify pledge creation
        let pledge = get_pledge(user_addr);
        assert!(pledge.creator == user_addr, 1);
        assert!(pledge.stake == 100, 2);
        assert!(!pledge.completed, 3);

        // Mark as completed
        mark_completed(&user);
        let pledge = get_pledge(user_addr);
        assert!(pledge.completed, 4);

        // Withdraw stake
        withdraw_or_burn(&user);
    }
} 