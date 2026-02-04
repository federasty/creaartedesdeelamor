import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Sale extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
    productId: string;

    @Prop({ required: true })
    productName: string;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    price: number; // Price at the time of sale

    @Prop()
    category: string;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
