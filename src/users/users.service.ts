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

  async findAll() {
    return await this.userModel.find().select('-password');
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
