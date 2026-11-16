import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findById(id: string) {
    return await this.userModel.findById(id).select('-password');
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findAll(query?: any) {
    const filter: any = {};
    if (query?.search && query.search.trim()) {
      const searchRegex = { $regex: query.search.trim(), $options: 'i' };
      filter.$or = [
        { name: searchRegex },
        { headline: searchRegex },
        { title: searchRegex },
        { role: searchRegex },
        { jobTitle: searchRegex },
        { about: searchRegex },
        { skills: searchRegex },
        { professional_skills: searchRegex },
      ];
    }
    if (query?.location && query.location.trim()) {
      const locRegex = { $regex: query.location.trim(), $options: 'i' };
      const locConditions = [
        { location: locRegex },
        { city: locRegex },
        { state: locRegex },
        { country: locRegex },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: locConditions }];
        delete filter.$or;
      } else {
        filter.$or = locConditions;
      }
    }
    return await this.userModel.find(filter).select('-password');
  }

  async updateProfile(
    id: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ) {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: updateUserProfileDto,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

}
