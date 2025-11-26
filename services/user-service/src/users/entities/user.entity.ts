import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum UserRole {
    USER = 'user',
    PROVIDER = 'provider',
    ADMIN = 'admin',
}

export enum PrivacyLevel {
    PUBLIC = 'public',
    ALIAS = 'alias',
    MEDIATED = 'mediated',
    GHOST = 'ghost',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password_hash: string;

    @Column({ nullable: true })
    full_name: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    // Privacy & Sovereignty
    @Column({
        type: 'enum',
        enum: PrivacyLevel,
        default: PrivacyLevel.ALIAS,
    })
    privacy_level: PrivacyLevel;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 50.00 })
    reputation_base: number;

    @Column({ nullable: true, length: 42 })
    wallet_address: string;

    // Location & Culture
    @Index({ spatial: true })
    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    })
    location: any; // GeoJSON Point

    @Column({ nullable: true })
    location_zone_id: string;

    @Column({ default: 'UTC' })
    timezone: string;

    @Column('text', { array: true, nullable: true })
    languages: string[];

    // Provider Specifics
    @Column('text', { array: true, nullable: true })
    skills: string[];

    @Column({ type: 'jsonb', nullable: true })
    availability_schedule: any;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
