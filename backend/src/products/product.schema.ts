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

    @Prop([String])
    images: string[];

    @Prop({ default: 1 })
    stock: number;

    @Prop()
    category: string; // Ejemplo: Budas, Ganeshas, Velas de Miel, Fuentes de Humo

    @Prop({ default: false })
    isSold: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
