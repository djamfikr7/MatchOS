import { Controller, Post, Body } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {
    constructor(private readonly campaignsService: CampaignsService) { }

    @Post('trigger')
    async trigger(@Body() payload: { request: any, categoryConfig: any }) {
        return this.campaignsService.triggerCampaign(payload.request, payload.categoryConfig);
    }
}
