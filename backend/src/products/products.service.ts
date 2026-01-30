import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

    async create(createProductDto: any) {
        const newProduct = new this.productModel(createProductDto);
        return await newProduct.save();
    }

    async findAll() {
        return await this.productModel.find().exec();
    }

    async remove(id: string) {
        return await this.productModel.findByIdAndDelete(id);
    }
}
