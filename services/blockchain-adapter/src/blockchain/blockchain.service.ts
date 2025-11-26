import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

// Mock ABI for ReputationNFT (only mint function needed for now)
const REPUTATION_NFT_ABI = [
    "function mint(address to, uint256 score, string memory category) external",
    "event Minted(address indexed to, uint256 tokenId, uint256 score, string category)"
];

@Injectable()
export class BlockchainService {
    private readonly logger = new Logger(BlockchainService.name);
    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet;
    private contract: ethers.Contract;

    // Hardcoded for MVP (Localhost / Mumbai Testnet)
    // In production, use process.env.ADMIN_PRIVATE_KEY
    private readonly ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    private readonly RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
    private readonly CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Mock address

    constructor() {
        this.initializeBlockchain();
    }

    private async initializeBlockchain() {
        try {
            this.provider = new ethers.JsonRpcProvider(this.RPC_URL);
            this.wallet = new ethers.Wallet(this.ADMIN_PRIVATE_KEY, this.provider);
            this.contract = new ethers.Contract(this.CONTRACT_ADDRESS, REPUTATION_NFT_ABI, this.wallet);
            this.logger.log(`Blockchain Service initialized. Connected to ${this.RPC_URL}`);
        } catch (error) {
            this.logger.error(`Failed to initialize blockchain service: ${error.message}`);
        }
    }

    async mintReputation(toAddress: string, score: number, category: string) {
        this.logger.log(`Attempting to mint Reputation NFT for ${toAddress} | Score: ${score} | Category: ${category}`);

        try {
            // In a real scenario, we would wait for the tx. 
            // For MVP without a real chain running, we might mock this if connection fails.

            // Check if provider is ready
            const network = await this.provider.getNetwork();
            this.logger.log(`Connected to network: ${network.name} (${network.chainId})`);

            const tx = await this.contract.mint(toAddress, score, category);
            this.logger.log(`Transaction sent: ${tx.hash}`);

            // Wait for confirmation (optional for fast feedback)
            // await tx.wait();

            return {
                success: true,
                txHash: tx.hash,
                message: "Minting transaction sent to blockchain."
            };

        } catch (error) {
            this.logger.error(`Minting failed: ${error.message}`);

            // Fallback for MVP if no local chain is running
            if (error.code === "NETWORK_ERROR" || error.code === "ECONNREFUSED") {
                this.logger.warn("Blockchain unreachable. Returning MOCK success for MVP demonstration.");
                return {
                    success: true,
                    txHash: "0xMOCK_TRANSACTION_HASH_" + Date.now(),
                    message: "Minting simulated (Blockchain unreachable)"
                };
            }

            throw error;
        }
    }
}
