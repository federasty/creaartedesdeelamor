import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    price: number;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    stock?: number;

    @IsOptional()
    @IsString()
    category?: string;
}
