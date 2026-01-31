import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const username = 'cecilia';
    const password = '4040';

    try {
        const existingUser = await usersService.findOne(username);
        if (existingUser) {
            console.log(`El usuario "${username}" ya existe.`);
        } else {
            await usersService.create(username, password);
            console.log(`Usuario "${username}" creado exitosamente.`);
        }
    } catch (error) {
        console.error('Error al crear el usuario:', error);
    } finally {
        await app.close();
    }
}

bootstrap();
