"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CampaignsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const axios_1 = require("axios");
let CampaignsService = CampaignsService_1 = class CampaignsService {
    constructor() {
        this.logger = new common_1.Logger(CampaignsService_1.name);
        this.aiCoreUrl = process.env.AI_CORE_URL || 'http://localhost:3004';
    }
    async triggerCampaign(request, categoryConfig) {
        this.logger.log(`Triggering campaign for Request ${request.id}`);
        try {
            const response = await axios_1.default.post(`${this.aiCoreUrl}/campaign/generate`, {
                request,
                categoryConfig
            });
            const campaigns = response.data.campaigns;
            for (const [platform, content] of Object.entries(campaigns)) {
                await this.postToSocialMedia(platform, content);
            }
            return { status: 'success', campaigns };
        }
        catch (error) {
            this.logger.error(`Failed to trigger campaign: ${error.message}`);
            throw error;
        }
    }
    async postToSocialMedia(platform, content) {
        this.logger.log(`[${platform.toUpperCase()}] Posting: ${content.copy.substring(0, 50)}...`);
        return true;
    }
    handleScheduledCampaigns() {
        this.logger.debug('Checking for scheduled campaigns...');
    }
};
exports.CampaignsService = CampaignsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CampaignsService.prototype, "handleScheduledCampaigns", null);
exports.CampaignsService = CampaignsService = CampaignsService_1 = __decorate([
    (0, common_1.Injectable)()
], CampaignsService);
//# sourceMappingURL=campaigns.service.js.map