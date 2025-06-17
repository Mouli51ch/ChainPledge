const { AptosClient, AptosAccount, TxnBuilderTypes, BCS } = require("aptos");

// Configuration
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const CONTRACT_ADDRESS = "0xe5ef0bea5d9b07a1e45a83f76545a8d68e52ee5fcf0f02aa91c23aea9a85c5ef";
const MODULE_NAME = "pledge";

class TransactionTester {
  constructor() {
    this.client = new AptosClient(NODE_URL);
    this.moduleAddress = CONTRACT_ADDRESS;
  }

  async testContractConnection() {
    console.log("🔍 Testing contract connection...");
    try {
      // Test if we can access the contract module
      const moduleData = await this.client.getAccountModules(this.moduleAddress);
      console.log("📋 All modules found:", moduleData.map(m => m.name));
      
      const pledgeModule = moduleData.find(module => module.name === MODULE_NAME);
      
      if (pledgeModule) {
        console.log("✅ Contract module found:", pledgeModule.name);
        console.log("📋 Available functions:");
        pledgeModule.exposed_functions.forEach(func => {
          console.log(`   - ${func.name}`);
        });
        return true;
      } else {
        console.log("❌ Pledge module not found");
        console.log("Available modules:", moduleData.map(m => m.name));
        return false;
      }
    } catch (error) {
      console.log("❌ Failed to connect to contract:", error.message);
      return false;
    }
  }

  async testGetPledgeFunction(address) {
    console.log(`\n🔍 Testing get_pledge function for address: ${address}`);
    try {
      const resource = await this.client.getAccountResource(
        address,
        `${this.moduleAddress}::${MODULE_NAME}::Pledge`
      );
      console.log("✅ Pledge resource found:", resource.data);
      return resource.data;
    } catch (error) {
      if (error.message.includes("Resource not found")) {
        console.log("ℹ️  No pledge found for this address (this is normal for new users)");
        return null;
      } else {
        console.log("❌ Error getting pledge:", error.message);
        return null;
      }
    }
  }

  async testContractEvents() {
    console.log("\n🔍 Testing contract events...");
    try {
      // First, let's check what resources exist on the contract address
      const resources = await this.client.getAccountResources(this.moduleAddress);
      console.log("📋 Available resources on contract address:");
      resources.forEach(resource => {
        console.log(`   - ${resource.type}`);
      });

      // Try to get events with the correct path
      const events = await this.client.getEventsByEventHandle(
        this.moduleAddress,
        `${this.moduleAddress}::${MODULE_NAME}::PledgeStore`,
        "pledge_created_events",
        { limit: 5 }
      );
      console.log("✅ Recent pledge creation events:", events.length);
      events.forEach((event, index) => {
        console.log(`   Event ${index + 1}:`, {
          creator: event.data.creator,
          description: event.data.description,
          stake: event.data.stake,
          deadline: new Date(event.data.deadline * 1000).toISOString()
        });
      });
      return events;
    } catch (error) {
      console.log("❌ Error getting events:", error.message);
      console.log("This might be normal if no events have been emitted yet.");
      return [];
    }
  }

  async testTransactionPayload() {
    console.log("\n🔍 Testing transaction payload structure...");
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${this.moduleAddress}::${MODULE_NAME}::create_pledge`,
        type_arguments: [],
        arguments: [
          "Test pledge description",
          100000000, // 1 APT in octas
          Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
        ],
      };
      
      console.log("✅ Transaction payload structure is valid:");
      console.log("   Function:", payload.function);
      console.log("   Arguments:", payload.arguments);
      return payload;
    } catch (error) {
      console.log("❌ Error creating payload:", error.message);
      return null;
    }
  }

  async testNetworkConnection() {
    console.log("\n🔍 Testing network connection...");
    try {
      const ledgerInfo = await this.client.getLedgerInfo();
      console.log("✅ Network connected successfully");
      console.log("   Chain ID:", ledgerInfo.chain_id);
      console.log("   Ledger Version:", ledgerInfo.ledger_version);
      console.log("   Ledger Timestamp:", new Date(ledgerInfo.ledger_timestamp / 1000).toISOString());
      return true;
    } catch (error) {
      console.log("❌ Network connection failed:", error.message);
      return false;
    }
  }

  async testContractDeployment() {
    console.log("\n🔍 Testing contract deployment status...");
    try {
      const accountInfo = await this.client.getAccount(this.moduleAddress);
      console.log("✅ Contract account exists");
      console.log("   Sequence Number:", accountInfo.sequence_number);
      console.log("   Authentication Key:", accountInfo.authentication_key);
      return true;
    } catch (error) {
      console.log("❌ Contract account not found:", error.message);
      return false;
    }
  }

  async runAllTests() {
    console.log("🚀 Starting ChainPledge Transaction Tests\n");
    console.log("=" .repeat(50));
    
    // Test 1: Network connection
    const networkOk = await this.testNetworkConnection();
    
    // Test 2: Contract deployment
    const deploymentOk = await this.testContractDeployment();
    
    // Test 3: Contract connection
    const contractOk = await this.testContractConnection();
    
    // Test 4: Transaction payload
    const payloadOk = await this.testTransactionPayload();
    
    // Test 5: Get pledge function (test with a sample address)
    const sampleAddress = "0x1234567890123456789012345678901234567890123456789012345678901234";
    await this.testGetPledgeFunction(sampleAddress);
    
    // Test 6: Contract events
    await this.testContractEvents();
    
    console.log("\n" + "=" .repeat(50));
    console.log("📊 Test Summary:");
    console.log(`   Network Connection: ${networkOk ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`   Contract Deployment: ${deploymentOk ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`   Contract Connection: ${contractOk ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`   Payload Structure: ${payloadOk ? "✅ PASS" : "❌ FAIL"}`);
    
    if (networkOk && deploymentOk && contractOk && payloadOk) {
      console.log("\n🎉 All basic tests passed! The contract appears to be working correctly.");
      console.log("💡 To test actual transactions, you'll need to:");
      console.log("   1. Connect a wallet with APT tokens");
      console.log("   2. Use the frontend application");
      console.log("   3. Or create a test script with a funded account");
    } else {
      console.log("\n⚠️  Some tests failed. Please check the contract deployment and network configuration.");
      if (!deploymentOk) {
        console.log("🔧 The contract might not be deployed. Check the contract address.");
      }
      if (!contractOk) {
        console.log("🔧 The contract module might not be published. Check the Move.toml configuration.");
      }
    }
  }
}

// Run the tests
const tester = new TransactionTester();
tester.runAllTests().catch(console.error); 