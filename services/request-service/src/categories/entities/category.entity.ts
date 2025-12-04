import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column({ default: 'core' })
    type: string;

    @Column({ type: 'jsonb', nullable: true })
    form_schema: any;

    @Column({ type: 'jsonb', nullable: true })
    ui_config: any;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;
}
