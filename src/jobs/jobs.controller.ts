import { Controller, Get, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { GetJobsQueryDto } from './dto/create-jobs.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async getJobs(@Query() query: GetJobsQueryDto) {
    const page = parseInt(query.page?.toString() || '1', 10);
    const limit = parseInt(query.limit?.toString() || '10', 10);

    return await this.jobsService.findAll({
      ...query,
      page,
      limit,
    });
  }
}
