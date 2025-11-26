import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';


export enum RequestStatus {
    OPEN = 'open',
    MATCHED = 'matched',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export enum TemporalType {
    FLEXIBLE = 'flexible',
    SCHEDULED = 'scheduled',
    URGENT = 'urgent',
    EMERGENCY = 'emergency',
}

@Entity('requests')
export class Request {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @Column({ nullable: true })
    category_id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    // AI Embeddings for Semantic Search
    // TODO: Enable after installing pgvector extension
    // @Column({ type: 'vector', length: 1536, nullable: true })
    // embedding: number[];

    // Temporal Intelligence
    @Column({
        type: 'enum',
        enum: TemporalType,
        default: TemporalType.FLEXIBLE,
    })
    temporal_type: TemporalType;

    @Column({ type: 'timestamptz', nullable: true })
    deadline: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    penalty_rate: number;

    // Geo-Strategy
    @Index({ spatial: true })
    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    })
    location: any; // GeoJSON Point

    @Column({ default: 10 })
    broadcast_radius_km: number;

    @Column({ default: false })
    privacy_zone: boolean;

    // Budget
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    budget_min: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    budget_max: number;

    @Column({ length: 3, default: 'DZD' })
    currency: string;

    @Column({
        type: 'enum',
        enum: RequestStatus,
        default: RequestStatus.OPEN,
    })
    status: RequestStatus;

    @Column({ type: 'jsonb', nullable: true })
    campaign_status: any;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
