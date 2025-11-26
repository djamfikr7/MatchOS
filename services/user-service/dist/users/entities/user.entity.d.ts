export declare enum UserRole {
    USER = "user",
    PROVIDER = "provider",
    ADMIN = "admin"
}
export declare enum PrivacyLevel {
    PUBLIC = "public",
    ALIAS = "alias",
    MEDIATED = "mediated",
    GHOST = "ghost"
}
export declare class User {
    id: string;
    email: string;
    password_hash: string;
    full_name: string;
    role: UserRole;
    privacy_level: PrivacyLevel;
    reputation_base: number;
    wallet_address: string;
    location: any;
    location_zone_id: string;
    timezone: string;
    languages: string[];
    skills: string[];
    availability_schedule: any;
    created_at: Date;
    updated_at: Date;
}
