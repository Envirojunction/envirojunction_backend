import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from './news.service';
import { GetNewsQueryDto } from './dto/create-news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(@Query() query: GetNewsQueryDto) {
    const page = parseInt(query.page?.toString() || '1', 10);
    const limit = parseInt(query.limit?.toString() || '10', 10);

    return await this.newsService.findAll({
      ...query,
      page,
      limit,
    });
  }
}
