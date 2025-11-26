"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BlockchainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainService = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const dotenv = require("dotenv");
dotenv.config();
const REPUTATION_NFT_ABI = [
    "function mint(address to, uint256 score, string memory category) external",
    "event Minted(address indexed to, uint256 tokenId, uint256 score, string category)"
];
let BlockchainService = BlockchainService_1 = class BlockchainService {
    constructor() {
        this.logger = new common_1.Logger(BlockchainService_1.name);
        this.ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        this.RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
        this.CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        this.initializeBlockchain();
    }
    async initializeBlockchain() {
        try {
            this.provider = new ethers_1.ethers.JsonRpcProvider(this.RPC_URL);
            this.wallet = new ethers_1.ethers.Wallet(this.ADMIN_PRIVATE_KEY, this.provider);
            this.contract = new ethers_1.ethers.Contract(this.CONTRACT_ADDRESS, REPUTATION_NFT_ABI, this.wallet);
            this.logger.log(`Blockchain Service initialized. Connected to ${this.RPC_URL}`);
        }
        catch (error) {
            this.logger.error(`Failed to initialize blockchain service: ${error.message}`);
        }
    }
    async mintReputation(toAddress, score, category) {
        this.logger.log(`Attempting to mint Reputation NFT for ${toAddress} | Score: ${score} | Category: ${category}`);
        try {
            const network = await this.provider.getNetwork();
            this.logger.log(`Connected to network: ${network.name} (${network.chainId})`);
            const tx = await this.contract.mint(toAddress, score, category);
            this.logger.log(`Transaction sent: ${tx.hash}`);
            return {
                success: true,
                txHash: tx.hash,
                message: "Minting transaction sent to blockchain."
            };
        }
        catch (error) {
            this.logger.error(`Minting failed: ${error.message}`);
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
};
exports.BlockchainService = BlockchainService;
exports.BlockchainService = BlockchainService = BlockchainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], BlockchainService);
//# sourceMappingURL=blockchain.service.js.map