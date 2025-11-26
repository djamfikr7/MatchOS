import { CampaignsService } from './campaigns.service';
export declare class CampaignsController {
    private readonly campaignsService;
    constructor(campaignsService: CampaignsService);
    trigger(payload: {
        request: any;
        categoryConfig: any;
    }): Promise<{
        status: string;
        campaigns: any;
    }>;
}
