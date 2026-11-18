import { Controller, Get, Post, Body, Query, Param, NotFoundException, UseGuards, Request } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobsDto, GetJobsQueryDto } from './dto/create-jobs.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

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

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANISATION, UserRole.ADMIN)
  async createJob(@Body() createJobDto: CreateJobsDto, @Request() req: any) {
    // If not specified, set the organisation to the poster's email / name
    if (!createJobDto.organisation) {
      createJobDto.organisation = req.user?.name || req.user?.email || 'Organisation';
    }
    return await this.jobsService.create(createJobDto);
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
