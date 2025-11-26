import { Controller, Post, Body, Logger } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller('reputation')
export class BlockchainController {
    private readonly logger = new Logger(BlockchainController.name);

    constructor(private readonly blockchainService: BlockchainService) { }

    @Post('mint')
    async mintReputation(@Body() body: { toAddress: string; score: number; category: string }) {
        this.logger.log(`Received mint request for ${body.toAddress}`);
        return this.blockchainService.mintReputation(body.toAddress, body.score, body.category);
    }
}
