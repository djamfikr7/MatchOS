import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import axios from 'axios';

@Injectable()
export class RequestsService {
    private readonly logger = new Logger(RequestsService.name);
    private readonly socialBotUrl = process.env.SOCIAL_BOT_URL || 'http://localhost:3005';

    constructor(
        @InjectRepository(Request)
        private requestsRepository: Repository<Request>,
    ) { }

    async create(createRequestDto: CreateRequestDto) {
        const { location, userId, ...rest } = createRequestDto;

        // Mock Geocoding: Convert string to GeoJSON Point (Algiers)
        const geoLocation = {
            type: 'Point',
            coordinates: [3.0588, 36.7528] // Longitude, Latitude
        };

        const request = this.requestsRepository.create({
            ...rest,
            user_id: userId,
            location: geoLocation
        });

        const savedRequest = await this.requestsRepository.save(request);

        // Trigger Campaign Agent (Fire & Forget)
        this.triggerCampaign(savedRequest).catch(err =>
            this.logger.error(`Failed to trigger campaign: ${err.message}`)
        );

        return savedRequest;
    }

    private async triggerCampaign(request: Request) {
        // In a real app, we'd fetch the Category Config from the DB or Config Service
        // For MVP, we'll construct a basic config based on the request
        const categoryConfig = {
            ai_campaigns: {
                platforms: ["whatsapp_status", "facebook_groups"],
                ad_copy_template: "🔥 New Request: {title} in {user_location}. Budget: {budget}. Apply now!",
                posting_schedule: "immediate"
            }
        };

        // Update status to 'PENDING'
        await this.requestsRepository.update(request.id, {
            campaign_status: { status: 'PENDING', platforms: categoryConfig.ai_campaigns.platforms }
        } as any);

        this.logger.log(`Triggering campaign for Request ${request.id}`);

        try {
            await axios.post(`${this.socialBotUrl}/campaigns/trigger`, {
                request,
                categoryConfig
            });
            // Update status to 'ACTIVE' (Simulated, in real app webhook would do this)
            await this.requestsRepository.update(request.id, {
                campaign_status: { status: 'ACTIVE', platforms: categoryConfig.ai_campaigns.platforms, last_updated: new Date() }
            } as any);
        } catch (error) {
            this.logger.error(`Failed to trigger campaign: ${error.message}`);
            await this.requestsRepository.update(request.id, {
                campaign_status: { status: 'FAILED', error: error.message }
            } as any);
        }
    }

    findAll() {
        return this.requestsRepository.find({ order: { created_at: 'DESC' } });
    }

    findOne(id: string) {
        return this.requestsRepository.findOneBy({ id });
    }

    async update(id: string, updateRequestDto: any) {
        await this.requestsRepository.update(id, updateRequestDto);
        return this.findOne(id);
    }

    remove(id: string) {
        return this.requestsRepository.delete(id);
    }
}
