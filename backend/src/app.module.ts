import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    // Si usas Mongo local, esta es la URL estándar. "mangata" es el nombre de la DB.
    MongooseModule.forRoot('mongodb+srv://fede_labestiaazul:fede123@cluster0.ilpnwag.mongodb.net/mangata'),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
