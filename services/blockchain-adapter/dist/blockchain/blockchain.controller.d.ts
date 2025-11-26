import { BlockchainService } from './blockchain.service';
export declare class BlockchainController {
    private readonly blockchainService;
    private readonly logger;
    constructor(blockchainService: BlockchainService);
    mintReputation(body: {
        toAddress: string;
        score: number;
        category: string;
    }): Promise<{
        success: boolean;
        txHash: any;
        message: string;
    }>;
}
