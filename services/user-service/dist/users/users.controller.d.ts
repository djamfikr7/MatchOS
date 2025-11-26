import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    mintReputation(req: any, body: {
        walletAddress: string;
    }): Promise<any>;
}
