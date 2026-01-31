import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Public } from '../auth/public.decorator';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    create(@Body() createProductDto: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
        if (file) {
            createProductDto.imageUrl = `/uploads/${file.filename}`;
        }
        return this.productsService.create(createProductDto);
    }

    @Public()
    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        if (file) {
            updateProductDto.imageUrl = `/uploads/${file.filename}`;
        }
        return this.productsService.update(id, updateProductDto);
    }

    @Public()
    @Patch(':id/sold')
    markAsSold(@Param('id') id: string) {
        return this.productsService.update(id, { isSold: true } as any);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
