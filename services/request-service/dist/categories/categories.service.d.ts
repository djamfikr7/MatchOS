import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
export declare class CategoriesService {
    private categoriesRepository;
    constructor(categoriesRepository: Repository<Category>);
    findAll(): Promise<Category[]>;
    findOne(slug: string): Promise<Category | null>;
}
