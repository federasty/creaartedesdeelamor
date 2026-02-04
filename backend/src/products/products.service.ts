import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

    async create(createProductDto: CreateProductDto) {
        // Asegurar tipos correctos si vienen de FormData (como strings)
        if (typeof createProductDto.isSold === 'string') {
            createProductDto.isSold = createProductDto.isSold === 'true';
        }
        if (typeof createProductDto.stock === 'string') {
            createProductDto.stock = parseInt(createProductDto.stock, 10);
        }

        // En Crea Arte desde el Amor, cada obra es única. Si no se especifica, el stock base es 1.
        if (createProductDto.stock === undefined || isNaN(createProductDto.stock)) {
            createProductDto.stock = 1;
        }
        // Sincronización: Si se crea como vendida, el stock debe ser 0.
        if (createProductDto.isSold) {
            createProductDto.stock = 0;
        }
        const newProduct = new this.productModel(createProductDto);
        return await newProduct.save();
    }

    async findAll() {
        return await this.productModel.find().exec();
    }

    // Nuevo: Solo productos disponibles (no vendidos)
    async findAvailable() {
        return await this.productModel.find({ isSold: { $ne: true } }).exec();
    }

    async findOne(id: string) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    // Nuevo: Verificar disponibilidad de múltiples productos con cantidades
    async checkAvailability(productItems: { productId: string, quantity: number }[]): Promise<{ available: string[], unavailable: string[] }> {
        const productIds = productItems.map(item => item.productId);
        const products = await this.productModel.find({
            _id: { $in: productIds }
        }).exec();

        const available: string[] = [];
        const unavailable: string[] = [];

        productItems.forEach(item => {
            const product = products.find(p => p._id.toString() === item.productId);
            if (product && !product.isSold && product.stock >= item.quantity) {
                available.push(item.productId);
            } else {
                unavailable.push(item.productId);
            }
        });

        return { available, unavailable };
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        // Asegurar tipos correctos si vienen de FormData (como strings)
        if (typeof updateProductDto.isSold === 'string') {
            updateProductDto.isSold = updateProductDto.isSold === 'true';
        }
        if (typeof updateProductDto.stock === 'string') {
            updateProductDto.stock = parseInt(updateProductDto.stock, 10);
        }

        // FALLA #5 FIX: Sincronización automática stock/isSold
        // Siempre sincronizar cuando se actualiza isSold
        if (updateProductDto.isSold !== undefined) {
            updateProductDto.stock = updateProductDto.isSold ? 0 : 1;
        }
        // También sincronizar si se actualiza stock a 0
        if (updateProductDto.stock !== undefined && (updateProductDto.stock === 0 || isNaN(updateProductDto.stock))) {
            updateProductDto.isSold = true;
            updateProductDto.stock = 0;
        }
        // Y si se pone stock > 0, marcar como disponible
        if (updateProductDto.stock !== undefined && updateProductDto.stock > 0) {
            updateProductDto.isSold = false;
        }

        const updatedProduct = await this.productModel
            .findByIdAndUpdate(id, updateProductDto, { new: true })
            .exec();
        if (!updatedProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return updatedProduct;
    }

    // Actualizado: Validación antes de descontar stock
    async markAsSold(id: string, quantity: number = 1) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        // Verificar si ya está vendido o no tiene stock
        if (product.isSold || product.stock <= 0) {
            throw new ConflictException('Este producto ya no tiene stock disponible');
        }

        // Verificar si la cantidad solicitada es mayor al stock
        if (product.stock < quantity) {
            throw new ConflictException(`Solo quedan ${product.stock} unidades disponibles`);
        }

        const newStock = product.stock - quantity;
        const isSoldNow = newStock === 0;

        // Descontar stock y marcar como vendido si llega a 0
        const updatedProduct = await this.productModel.findByIdAndUpdate(
            id,
            { isSold: isSoldNow, stock: newStock },
            { new: true }
        ).exec();

        return updatedProduct;
    }

    // FALLA #6 FIX: Permitir marcar como disponible nuevamente
    async markAsAvailable(id: string) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        const updatedProduct = await this.productModel.findByIdAndUpdate(
            id,
            { isSold: false, stock: 1 },
            { new: true }
        ).exec();

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
