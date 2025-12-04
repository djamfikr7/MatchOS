export class CreateRequestDto {
    title: string;
    description: string;
    location: string;
    budget: number;
    userId: string;
    dynamic_data?: any;
}
