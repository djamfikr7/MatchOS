import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import axios from 'axios';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    private readonly blockchainAdapterUrl = process.env.BLOCKCHAIN_ADAPTER_URL || 'http://localhost:3006';

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(userData: Partial<User>): Promise<User> {
        const user = this.usersRepository.create(userData);
        return this.usersRepository.save(user);
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findOneById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async mintReputationToken(userId: string, walletAddress: string) {
        const user = await this.findOneById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Calculate Score (Simple logic for MVP: Base + Skills count * 10)
        const score = Math.floor(Number(user.reputation_base) + (user.skills ? user.skills.length * 10 : 0));
        const category = user.skills && user.skills.length > 0 ? user.skills[0] : 'General';

        this.logger.log(`Minting Reputation NFT for User ${userId} (${walletAddress}) | Score: ${score}`);

        try {
            const response = await axios.post(`${this.blockchainAdapterUrl}/reputation/mint`, {
                toAddress: walletAddress,
                score: score,
                category: category
            });
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to mint token: ${error.message}`);
            throw new Error('Blockchain interaction failed');
        }
    }
}
