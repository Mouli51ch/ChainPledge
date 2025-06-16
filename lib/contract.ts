import { AptosClient, AptosAccount, TxnBuilderTypes, BCS } from "aptos";
import { useWallet } from "@/hooks/useWallet";

export interface Pledge {
  creator: string;
  description: string;
  stake: number;
  deadline: number;
  completed: boolean;
}

export class PledgeContract {
  private client: AptosClient;
  private moduleAddress: string;

  constructor(client: AptosClient, moduleAddress: string) {
    this.client = client;
    this.moduleAddress = moduleAddress;
  }

  async createPledge(
    account: AptosAccount,
    description: string,
    stake: number,
    deadline: number
  ): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::pledge::create_pledge`,
      type_arguments: [],
      arguments: [description, stake, deadline],
    };

    const txnHash = await this.client.generateSignSubmitTransaction(
      account,
      payload
    );
    await this.client.waitForTransaction(txnHash);
    return txnHash;
  }

  async markCompleted(account: AptosAccount): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::pledge::mark_completed`,
      type_arguments: [],
      arguments: [],
    };

    const txnHash = await this.client.generateSignSubmitTransaction(
      account,
      payload
    );
    await this.client.waitForTransaction(txnHash);
    return txnHash;
  }

  async withdrawOrBurn(account: AptosAccount): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::pledge::withdraw_or_burn`,
      type_arguments: [],
      arguments: [],
    };

    const txnHash = await this.client.generateSignSubmitTransaction(
      account,
      payload
    );
    await this.client.waitForTransaction(txnHash);
    return txnHash;
  }

  async getPledge(address: string): Promise<Pledge> {
    const resource = await this.client.getAccountResource(
      address,
      `${this.moduleAddress}::pledge::Pledge`
    );
    return resource.data as Pledge;
  }
}

export function usePledgeContract() {
  const { wallet } = useWallet();
  const client = new AptosClient(process.env.NEXT_PUBLIC_APTOS_NODE_URL || "https://fullnode.mainnet.aptoslabs.com");
  const moduleAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

  return {
    contract: new PledgeContract(client, moduleAddress),
    client,
  };
} 