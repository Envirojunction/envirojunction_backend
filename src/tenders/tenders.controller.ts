import { Controller, Get, Post, Body, Param, Query, NotFoundException, UseGuards, Request } from '@nestjs/common';
import { TendersService } from './tenders.service';
import { CreateNewsDto, GetNewsQueryDto } from './dto/create-tenders.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

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

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANISATION, UserRole.ADMIN)
  async createTender(@Body() createTenderDto: CreateNewsDto, @Request() req: any) {
    if (!createTenderDto.organisation) {
      createTenderDto.organisation = req.user?.name || req.user?.email || 'Organisation';
    }
    return await this.tendersService.create(createTenderDto);
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
