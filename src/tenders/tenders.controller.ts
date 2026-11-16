import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { TendersService } from './tenders.service';
import { GetNewsQueryDto } from './dto/create-tenders.dto';

@Controller('tenders')
export class TendersController {
  constructor(private readonly tendersService: TendersService) {}

  @Get()
  async getTenders(@Query() query: GetNewsQueryDto) {
    const page = parseInt(query.page?.toString() || '1', 10);
    const limit = parseInt(query.limit?.toString() || '10', 10);

    return await this.tendersService.findAll({
      ...query,
      page,
      limit,
    });
  }

  @Get(':id')
  async getTenderById(@Param('id') id: string) {
    const tender = await this.tendersService.findById(id);
    if (!tender) {
      throw new NotFoundException(`Tender with ID ${id} not found`);
    }
    return tender;
  }
}
