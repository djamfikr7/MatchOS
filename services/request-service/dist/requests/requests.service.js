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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RequestsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const request_entity_1 = require("./entities/request.entity");
const axios_1 = __importDefault(require("axios"));
let RequestsService = RequestsService_1 = class RequestsService {
    requestsRepository;
    logger = new common_1.Logger(RequestsService_1.name);
    socialBotUrl = process.env.SOCIAL_BOT_URL || 'http://localhost:3005';
    constructor(requestsRepository) {
        this.requestsRepository = requestsRepository;
    }
    async create(createRequestDto) {
        const { location, userId, ...rest } = createRequestDto;
        const geoLocation = {
            type: 'Point',
            coordinates: [3.0588, 36.7528]
        };
        const request = this.requestsRepository.create({
            ...rest,
            user_id: userId,
            location: geoLocation
        });
        const savedRequest = await this.requestsRepository.save(request);
        this.triggerCampaign(savedRequest).catch(err => this.logger.error(`Failed to trigger campaign: ${err.message}`));
        return savedRequest;
    }
    async triggerCampaign(request) {
        const categoryConfig = {
            ai_campaigns: {
                platforms: ["whatsapp_status", "facebook_groups"],
                ad_copy_template: "🔥 New Request: {title} in {user_location}. Budget: {budget}. Apply now!",
                posting_schedule: "immediate"
            }
        };
        await this.requestsRepository.update(request.id, {
            campaign_status: { status: 'PENDING', platforms: categoryConfig.ai_campaigns.platforms }
        });
        this.logger.log(`Triggering campaign for Request ${request.id}`);
        try {
            await axios_1.default.post(`${this.socialBotUrl}/campaigns/trigger`, {
                request,
                categoryConfig
            });
            await this.requestsRepository.update(request.id, {
                campaign_status: { status: 'ACTIVE', platforms: categoryConfig.ai_campaigns.platforms, last_updated: new Date() }
            });
        }
        catch (error) {
            this.logger.error(`Failed to trigger campaign: ${error.message}`);
            await this.requestsRepository.update(request.id, {
                campaign_status: { status: 'FAILED', error: error.message }
            });
        }
    }
    findAll() {
        return this.requestsRepository.find({ order: { created_at: 'DESC' } });
    }
    findOne(id) {
        return this.requestsRepository.findOneBy({ id });
    }
    async update(id, updateRequestDto) {
        await this.requestsRepository.update(id, updateRequestDto);
        return this.findOne(id);
    }
    remove(id) {
        return this.requestsRepository.delete(id);
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = RequestsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(request_entity_1.Request)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RequestsService);
//# sourceMappingURL=requests.service.js.map