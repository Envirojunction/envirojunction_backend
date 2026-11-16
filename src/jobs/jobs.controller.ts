import { Controller, Get, Query, Param, NotFoundException } from '@nestjs/common';
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

  @Get(':id')
  async getJobById(@Param('id') id: string) {
    const job = await this.jobsService.findById(id);
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return job;
  }
}
