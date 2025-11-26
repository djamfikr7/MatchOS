import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class CampaignsService {
    private readonly logger = new Logger(CampaignsService.name);
    private readonly aiCoreUrl = process.env.AI_CORE_URL || 'http://localhost:3004';

    async triggerCampaign(request: any, categoryConfig: any) {
        this.logger.log(`Triggering campaign for Request ${request.id}`);

        try {
            // 1. Generate Campaign Content via AI Core
            const response = await axios.post(`${this.aiCoreUrl}/campaign/generate`, {
                request,
                categoryConfig
            });

            const campaigns = response.data.campaigns;

            // 2. Schedule/Post to Platforms
            for (const [platform, content] of Object.entries(campaigns)) {
                await this.postToSocialMedia(platform, content);
            }

            return { status: 'success', campaigns };
        } catch (error) {
            this.logger.error(`Failed to trigger campaign: ${error.message}`);
            throw error;
        }
    }

    private async postToSocialMedia(platform: string, content: any) {
        // Mock implementation
        this.logger.log(`[${platform.toUpperCase()}] Posting: ${content.copy.substring(0, 50)}...`);
        // In real implementation, use Meta Graph API / WhatsApp Business API here
        return true;
    }

    @Cron(CronExpression.EVERY_HOUR)
    handleScheduledCampaigns() {
        this.logger.debug('Checking for scheduled campaigns...');
        // Logic to fetch pending campaigns from DB and post them
    }
}
