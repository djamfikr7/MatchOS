import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    create(createRequestDto: CreateRequestDto): Promise<import("./entities/request.entity").Request>;
    findAll(): Promise<import("./entities/request.entity").Request[]>;
    findOne(id: string): Promise<import("./entities/request.entity").Request | null>;
    update(id: string, updateRequestDto: any): Promise<import("./entities/request.entity").Request | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
