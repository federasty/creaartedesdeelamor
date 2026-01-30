import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Esto añade fecha de creación y actualización sola
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  imageUrl: string; // Aquí pondremos el link de la foto que subas
  
  @Prop({ default: true })
  active: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
