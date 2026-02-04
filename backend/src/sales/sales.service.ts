import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale } from './sale.schema';

@Injectable()
export class SalesService {
    constructor(@InjectModel(Sale.name) private saleModel: Model<Sale>) { }

    async create(saleData: any) {
        const newSale = new this.saleModel(saleData);
        return await newSale.save();
    }

    async findAll() {
        return await this.saleModel.find().sort({ createdAt: -1 }).exec();
    }

    async getStats() {
        const sales = await this.saleModel.find().exec();
        const totalRevenue = sales.reduce((acc, sale) => acc + (sale.price * sale.quantity), 0);
        return {
            totalSales: sales.length,
            totalItemsSold: sales.reduce((acc, sale) => acc + sale.quantity, 0),
            totalRevenue,
        };
    }
}
