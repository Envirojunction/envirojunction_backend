import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tender, TenderDocument } from './schemas/tenders.schema';
import { CreateNewsDto, GetNewsQueryDto } from './dto/create-tenders.dto';

@Injectable()
export class TendersService {
  constructor(
    @InjectModel(Tender.name) private tenderModel: Model<TenderDocument>,
  ) {}

  async create(createNewsDto: CreateNewsDto) {
    const newNews = await this.tenderModel.create(createNewsDto);
    return newNews;
  }

  async createMany(newsArray: CreateNewsDto[]) {
    return await this.tenderModel.insertMany(newsArray);
  }

  async findAll(query: GetNewsQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};

    if (query.category && query.category !== 'all') {
      filter.$or = [
        { sector: { $regex: query.category, $options: 'i' } },
        { authority_type: { $regex: query.category, $options: 'i' } },
        { category: { $regex: query.category, $options: 'i' } },
      ];
    }

    if (query.search && query.search.trim()) {
      const searchOr = [
        { title: { $regex: query.search.trim(), $options: 'i' } },
        { description: { $regex: query.search.trim(), $options: 'i' } },
        { organisation: { $regex: query.search.trim(), $options: 'i' } },
        { sector: { $regex: query.search.trim(), $options: 'i' } },
        { location: { $regex: query.search.trim(), $options: 'i' } },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchOr }];
        delete filter.$or;
      } else {
        filter.$or = searchOr;
      }
    }

    // Get total count
    const total = await this.tenderModel.countDocuments(filter);

    // Get paginated results
    const data = await this.tenderModel
      .find(filter)
      .select({ full_content_html: 0 })
      .sort({ _id: -1 })
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
    return await this.tenderModel.findById(id);
  }

  async update(id: string, updateData: Partial<CreateNewsDto>) {
    return await this.tenderModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string) {
    return await this.tenderModel.findByIdAndDelete(id);
  }

  async deleteAll() {
    return await this.tenderModel.deleteMany({});
  }

  async count() {
    return await this.tenderModel.countDocuments();
  }
}
