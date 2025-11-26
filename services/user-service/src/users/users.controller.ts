import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Post('mint-reputation')
    async mintReputation(@Request() req, @Body() body: { walletAddress: string }) {
        return this.usersService.mintReputationToken(req.user.userId, body.walletAddress);
    }
}
