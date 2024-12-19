import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from '../service/category.service';
import { AuthGuard } from '../../auth';
import { FileValidatePipe } from '@/common/pipes';
import { CategoryCreateNameDto, CategoryUpdateNameDto } from '../dto';
import { ImageFolderName } from '@/common/services';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('CategoryController', () => {
    let app: INestApplication;
    let categoryService: CategoryService;

    const mockCategoryService = {
        findAllCategories: jest.fn(),
        createCategory: jest.fn(),
        deleteCategory: jest.fn(),
        findCategoryById: jest.fn(),
        findCategoryByName: jest.fn(),
        updateCategory: jest.fn(),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CategoryController],
            providers: [
                {
                    provide: CategoryService,
                    useValue: mockCategoryService,
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        app = module.createNestApplication();
        await app.init();
        categoryService = module.get<CategoryService>(CategoryService);
    });

    afterAll(async () => {
        await app.close();
    });

    it('should return all categories', async () => {
        const categories = [{ id: '1', name: 'Category 1', imageUrl: 'url1' }];
        mockCategoryService.findAllCategories.mockResolvedValue(categories);

        const response = await request(app.getHttpServer()).get('/category').expect(200);

        expect(response.body).toEqual(categories);
    });

    it('should create a category', async () => {
        const categoryDto: CategoryCreateNameDto = { name: 'New Category' };
        const file = { buffer: Buffer.from('file content') } as Express.Multer.File;
        const createdCategory = { id: '1', name: 'New Category', imageUrl: 'url' };

        mockCategoryService.createCategory.mockResolvedValue(createdCategory);

        const response = await request(app.getHttpServer())
            .post('/category')
            .field('name', categoryDto.name)
            .attach('image', Buffer.from(file.buffer), 'image.jpg')
            .expect(201);

        expect(response.body).toEqual(createdCategory);
    });

    it('should delete a category', async () => {
        const categoryId = '1';
        const deletedCategory = { id: '1', name: 'Category 1', imageUrl: 'url1' };

        mockCategoryService.deleteCategory.mockResolvedValue(deletedCategory);

        const response = await request(app.getHttpServer()).delete(`/category/${categoryId}`).expect(200);

        expect(response.body).toEqual(deletedCategory);
    });

    it('should return a category by id', async () => {
        const categoryId = '1';
        const category = { id: '1', name: 'Category 1', imageUrl: 'url1' };

        mockCategoryService.findCategoryById.mockResolvedValue(category);

        const response = await request(app.getHttpServer()).get(`/category/${categoryId}`).expect(200);

        expect(response.body).toEqual(category);
    });

    it('should return a category by name', async () => {
        const categoryName = 'Category 1';
        const category = { id: '1', name: 'Category 1', imageUrl: 'url1' };

        mockCategoryService.findCategoryByName.mockResolvedValue(category);

        const response = await request(app.getHttpServer()).post('/category/name').send({ name: categoryName }).expect(200);

        expect(response.body).toEqual(category);
    });

    it('should update a category', async () => {
        const categoryId = '1';
        const categoryDto: CategoryUpdateNameDto = { name: 'Updated Category' };
        const file = { buffer: Buffer.from('file content') } as Express.Multer.File;
        const updatedCategory = { id: '1', name: 'Updated Category', imageUrl: 'url' };

        mockCategoryService.updateCategory.mockResolvedValue(updatedCategory);

        const response = await request(app.getHttpServer())
            .put(`/category/${categoryId}`)
            .field('name', categoryDto.name)
            .attach('image', Buffer.from(file.buffer), 'image.jpg')
            .expect(200);

        expect(response.body).toEqual(updatedCategory);
    });
});