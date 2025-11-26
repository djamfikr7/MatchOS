export declare class BlockchainService {
    private readonly logger;
    private provider;
    private wallet;
    private contract;
    private readonly ADMIN_PRIVATE_KEY;
    private readonly RPC_URL;
    private readonly CONTRACT_ADDRESS;
    constructor();
    private initializeBlockchain;
    mintReputation(toAddress: string, score: number, category: string): Promise<{
        success: boolean;
        txHash: any;
        message: string;
    }>;
}
