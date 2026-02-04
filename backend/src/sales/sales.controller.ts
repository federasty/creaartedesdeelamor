import { Controller, Get } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Public } from '../auth/public.decorator';

@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Public()
    @Get()
    findAll() {
        return this.salesService.findAll();
    }

    @Public()
    @Get('stats')
    getStats() {
        return this.salesService.getStats();
    }
}
