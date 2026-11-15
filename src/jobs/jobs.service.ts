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
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};

    if (query.category) {
      filter.category = { $regex: query.category, $options: 'i' };
    }

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Get total count
    const total = await this.jobModel.countDocuments(filter);

    // Get paginated results
    const data = await this.jobModel
      .find(filter)
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
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
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
