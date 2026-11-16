import { Controller, Get, Query, Param, NotFoundException } from '@nestjs/common';
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

  @Get(':id')
  async getNewsById(@Param('id') id: string) {
    const article = await this.newsService.findById(id);
    if (!article) {
      throw new NotFoundException(`News article with ID ${id} not found`);
    }
    return article;
  }
}
