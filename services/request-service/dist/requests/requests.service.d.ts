import { Repository } from 'typeorm';
import { Request } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
export declare class RequestsService {
    private requestsRepository;
    private readonly logger;
    private readonly socialBotUrl;
    constructor(requestsRepository: Repository<Request>);
    create(createRequestDto: CreateRequestDto): Promise<Request>;
    private triggerCampaign;
    findAll(): Promise<Request[]>;
    findOne(id: string): Promise<Request | null>;
    update(id: string, updateRequestDto: any): Promise<Request | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
