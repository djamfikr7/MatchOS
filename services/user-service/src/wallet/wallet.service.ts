import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

export interface CreditBundle {
    id: string;
    name: string;
    credits: number;
    price_dzd: number;
    popular?: boolean;
}

export const CREDIT_BUNDLES: CreditBundle[] = [
    { id: 'starter', name: 'Starter Pack', credits: 5, price_dzd: 500 },
    { id: 'standard', name: 'Standard Pack', credits: 10, price_dzd: 1000, popular: true },
    { id: 'premium', name: 'Premium Pack', credits: 25, price_dzd: 2000 },
    { id: 'business', name: 'Business Pack', credits: 100, price_dzd: 7000 },
];

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async getBalance(userId: string): Promise<{ credits: number; transactions: any[] }> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return {
            credits: (user as any).credits || 0,
            transactions: [], // TODO: Implement transaction history
        };
    }

    async getBundles(): Promise<CreditBundle[]> {
        return CREDIT_BUNDLES;
    }

    async purchaseBundle(
        userId: string,
        bundleId: string,
        paymentMethod: string,
        paymentReference?: string,
    ): Promise<{ success: boolean; newBalance: number; message: string }> {
        const bundle = CREDIT_BUNDLES.find(b => b.id === bundleId);
        if (!bundle) {
            throw new BadRequestException('Invalid bundle');
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Simulate payment verification
        // In production: verify BaridiMob receipt, CIB transaction, etc.
        if (paymentMethod === 'baridimob') {
            // TODO: Call AI to verify payment screenshot/receipt
            console.log(`Simulating BaridiMob payment verification for ref: ${paymentReference}`);
        }

        // Add credits
        const currentCredits = (user as any).credits || 0;
        const newBalance = currentCredits + bundle.credits;

        await this.userRepository.update(userId, { credits: newBalance } as any);

        return {
            success: true,
            newBalance,
            message: `Successfully purchased ${bundle.credits} credits!`,
        };
    }

    async deductCredits(
        userId: string,
        amount: number,
        reason: string,
    ): Promise<{ success: boolean; newBalance: number }> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const currentCredits = (user as any).credits || 0;
        if (currentCredits < amount) {
            throw new BadRequestException('Insufficient credits');
        }

        const newBalance = currentCredits - amount;
        await this.userRepository.update(userId, { credits: newBalance } as any);

        console.log(`Deducted ${amount} credits from user ${userId} for: ${reason}`);

        return {
            success: true,
            newBalance,
        };
    }

    async addCredits(
        userId: string,
        amount: number,
        reason: string,
    ): Promise<{ success: boolean; newBalance: number }> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const currentCredits = (user as any).credits || 0;
        const newBalance = currentCredits + amount;
        await this.userRepository.update(userId, { credits: newBalance } as any);

        console.log(`Added ${amount} credits to user ${userId} for: ${reason}`);

        return {
            success: true,
            newBalance,
        };
    }
}
