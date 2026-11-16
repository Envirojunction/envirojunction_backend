import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from './schemas/jobs.schema';
import { CreateJobsDto, GetJobsQueryDto } from './dto/create-jobs.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
  ) {}

  async create(createNewsDto: CreateJobsDto) {
    const newNews = await this.jobModel.create(createNewsDto);
    return newNews;
  }

  async createMany(newsArray: CreateJobsDto[]) {
    return await this.jobModel.insertMany(newsArray);
  }

  async findAll(query: GetJobsQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};

    if (query.category && query.category !== 'all') {
      filter.$or = [
        { category: { $regex: query.category, $options: 'i' } },
        { title: { $regex: query.category, $options: 'i' } },
        { description: { $regex: query.category, $options: 'i' } },
      ];
    }

    if (query.job_type && query.job_type !== 'all') {
      filter.job_type = { $regex: query.job_type, $options: 'i' };
    }

    if (query.location) {
      filter.location = { $regex: query.location, $options: 'i' };
    }

    if (query.organisation) {
      filter.organisation = { $regex: query.organisation, $options: 'i' };
    }

    if (query.search && query.search.trim()) {
      const searchRegex = { $regex: query.search.trim(), $options: 'i' };
      const searchConditions: any[] = [
        { title: searchRegex },
        { description: searchRegex },
        { organisation: searchRegex },
        { location: searchRegex },
        { responsibilities: searchRegex },
        { requirements: searchRegex },
        { job_type: searchRegex },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    // Get total count
    const total = await this.jobModel.countDocuments(filter);

    // Get paginated results excluding heavy scraped HTML
    const data = await this.jobModel
      .find(filter)
      .select({ full_content_html: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 1,
        hasNext: page < (Math.ceil(total / limit) || 1),
        hasPrev: page > 1,
      },
    };
  }

  async findById(id: string) {
    return await this.jobModel.findById(id);
  }

  async update(id: string, updateData: Partial<CreateJobsDto>) {
    return await this.jobModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string) {
    return await this.jobModel.findByIdAndDelete(id);
  }

  async deleteAll() {
    return await this.jobModel.deleteMany({});
  }

  async count() {
    return await this.jobModel.countDocuments();
  }
}
