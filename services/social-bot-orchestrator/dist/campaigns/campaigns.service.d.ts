export declare class CampaignsService {
    private readonly logger;
    private readonly aiCoreUrl;
    triggerCampaign(request: any, categoryConfig: any): Promise<{
        status: string;
        campaigns: any;
    }>;
    private postToSocialMedia;
    handleScheduledCampaigns(): void;
}
