import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WalletService } from './wallet.service';

class PurchaseBundleDto {
    bundleId: string;
    paymentMethod: string; // 'baridimob' | 'cib' | 'flexy' | 'admin_grant'
    paymentReference?: string; // Transaction ID or receipt
}

class DeductCreditsDto {
    amount: number;
    reason: string;
}

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('balance')
    async getBalance(@Request() req) {
        return this.walletService.getBalance(req.user.id);
    }

    @Get('bundles')
    async getBundles() {
        return this.walletService.getBundles();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('purchase')
    async purchaseBundle(@Request() req, @Body() dto: PurchaseBundleDto) {
        return this.walletService.purchaseBundle(
            req.user.id,
            dto.bundleId,
            dto.paymentMethod,
            dto.paymentReference,
        );
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('deduct')
    async deductCredits(@Request() req, @Body() dto: DeductCreditsDto) {
        return this.walletService.deductCredits(
            req.user.id,
            dto.amount,
            dto.reason,
        );
    }
}
