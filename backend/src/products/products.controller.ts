import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile, Patch, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
    @UseInterceptors(FilesInterceptor('images', 10, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    create(@Body() createProductDto: CreateProductDto, @UploadedFiles() files: Express.Multer.File[]) {
        if (files && files.length > 0) {
            createProductDto.images = files.map(file => `/uploads/${file.filename}`);
            createProductDto.imageUrl = createProductDto.images[0];
        }
        return this.productsService.create(createProductDto);
    }

    @Public()
    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    // Nuevo endpoint: Solo productos disponibles (para la tienda)
    @Public()
    @Get('available')
    findAvailable() {
        return this.productsService.findAvailable();
    }

    // Nuevo endpoint: Verificar disponibilidad de productos en el carrito (FALLA #3 y #4 FIX)
    @Public()
    @Post('check-availability')
    checkAvailability(@Body() body: { productItems: { productId: string, quantity: number }[] }) {
        return this.productsService.checkAvailability(body.productItems);
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @UseInterceptors(FilesInterceptor('images', 10, {
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
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        if (files && files.length > 0) {
            updateProductDto.images = files.map(file => `/uploads/${file.filename}`);
            updateProductDto.imageUrl = updateProductDto.images[0];
        }
        return this.productsService.update(id, updateProductDto);
    }

    // FALLA #9 FIX: Usa el nuevo método que valida antes de vender
    @Public()
    @Patch(':id/sold')
    markAsSold(@Param('id') id: string, @Body() body: { quantity?: number }) {
        return this.productsService.markAsSold(id, body.quantity || 1);
    }

    // FALLA #6 FIX: Nuevo endpoint para marcar como disponible (solo admin)
    @Patch(':id/available')
    markAsAvailable(@Param('id') id: string) {
        return this.productsService.markAsAvailable(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
