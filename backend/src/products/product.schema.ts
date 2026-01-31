import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop()
    imageUrl: string;

    @Prop({ default: 0 })
    stock: number;

    @Prop()
    category: string; // Ejemplo: Aromática, Decorativa, Especial
}

export const ProductSchema = SchemaFactory.createForClass(Product);
