import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

    async create(createProductDto: CreateProductDto) {
        // En Mangata, cada obra es única. Si no se especifica, el stock base es 1.
        if (createProductDto.stock === undefined) {
            createProductDto.stock = 1;
        }
        // Si se crea como vendida, el stock debe ser 0.
        if (createProductDto.isSold) {
            createProductDto.stock = 0;
        }
        const newProduct = new this.productModel(createProductDto);
        return await newProduct.save();
    }

    async findAll() {
        return await this.productModel.find().exec();
    }

    async findOne(id: string) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        // Sincronización lógica para piezas únicas
        if (updateProductDto.isSold !== undefined) {
            updateProductDto.stock = updateProductDto.isSold ? 0 : 1;
        }

        const updatedProduct = await this.productModel
            .findByIdAndUpdate(id, updateProductDto, { new: true })
            .exec();
        if (!updatedProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return updatedProduct;
    }

    async remove(id: string) {
        const result = await this.productModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return result;
    }
}
