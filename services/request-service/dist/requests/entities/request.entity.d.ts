export declare enum RequestStatus {
    OPEN = "open",
    MATCHED = "matched",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum TemporalType {
    FLEXIBLE = "flexible",
    SCHEDULED = "scheduled",
    URGENT = "urgent",
    EMERGENCY = "emergency"
}
export declare class Request {
    id: string;
    user_id: string;
    category_id: string;
    title: string;
    description: string;
    temporal_type: TemporalType;
    deadline: Date;
    penalty_rate: number;
    location: any;
    broadcast_radius_km: number;
    privacy_zone: boolean;
    budget_min: number;
    budget_max: number;
    currency: string;
    status: RequestStatus;
    campaign_status: any;
    created_at: Date;
    updated_at: Date;
}
