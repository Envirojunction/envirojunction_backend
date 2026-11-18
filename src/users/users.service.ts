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
    const existingUser = await this.userModel.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatePayload: any = { ...updateUserProfileDto };

    // If organisation details are passed or user is an organisation, synchronize organisationDetails subdocument
    if (existingUser.role === 'organisation' || updateUserProfileDto.organisationDetails) {
      const currentOrg = existingUser.organisationDetails
        ? (existingUser.organisationDetails as any).toObject
          ? (existingUser.organisationDetails as any).toObject()
          : existingUser.organisationDetails
        : {};
      const newOrgDetails = {
        ...currentOrg,
        ...(updateUserProfileDto.organisationDetails || {}),
      };

      if (updateUserProfileDto.name) newOrgDetails.companyName = updateUserProfileDto.name;
      if (updateUserProfileDto.about) newOrgDetails.about = updateUserProfileDto.about;
      if (updateUserProfileDto.headline) newOrgDetails.headline = updateUserProfileDto.headline;
      if (updateUserProfileDto.website) newOrgDetails.website = updateUserProfileDto.website;
      if (updateUserProfileDto.linkedin) newOrgDetails.linkedin = updateUserProfileDto.linkedin;
      if (updateUserProfileDto.companySize) newOrgDetails.companySize = updateUserProfileDto.companySize;
      if (updateUserProfileDto.primaryUseCase) newOrgDetails.primaryUseCase = updateUserProfileDto.primaryUseCase;
      if (updateUserProfileDto.expertise) newOrgDetails.expertise = updateUserProfileDto.expertise;
      if (updateUserProfileDto.headquarters) newOrgDetails.headquarters = updateUserProfileDto.headquarters;
      if (updateUserProfileDto.organizationType) newOrgDetails.organizationType = updateUserProfileDto.organizationType;
      if (updateUserProfileDto.founded) newOrgDetails.founded = updateUserProfileDto.founded;
      if (updateUserProfileDto.phone) newOrgDetails.phone = updateUserProfileDto.phone;
      if (updateUserProfileDto.avatar) newOrgDetails.logo = updateUserProfileDto.avatar;
      if (updateUserProfileDto.banner) newOrgDetails.banner = updateUserProfileDto.banner;
      if (updateUserProfileDto.gstNumber) newOrgDetails.gstNumber = updateUserProfileDto.gstNumber;
      if (updateUserProfileDto.cinNumber) newOrgDetails.cinNumber = updateUserProfileDto.cinNumber;

      updatePayload.organisationDetails = newOrgDetails;
    }

    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: updatePayload,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .select('-password');

    return user;
  }

  async updateRole(id: string, role: string) {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { role } },
        { new: true, runValidators: true },
      )
      .select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async followOrganisation(userId: string, orgId: string) {
    const org = await this.userModel.findById(orgId);
    if (!org) {
      throw new NotFoundException('Organisation not found');
    }

    // Add orgId to user's followedOrganisations
    await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { followedOrganisations: String(orgId) } },
      { new: true },
    );

    // Add userId to org's followers
    const updatedOrg = await this.userModel.findByIdAndUpdate(
      orgId,
      { $addToSet: { followers: String(userId) } },
      { new: true },
    );

    const followersCount = (updatedOrg?.followers || []).length;

    return {
      success: true,
      isFollowing: true,
      followersCount,
      organisationId: orgId,
      message: `Successfully followed ${org.name}`,
    };
  }

  async unfollowOrganisation(userId: string, orgId: string) {
    const org = await this.userModel.findById(orgId);
    if (!org) {
      throw new NotFoundException('Organisation not found');
    }

    // Remove orgId from user's followedOrganisations
    await this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { followedOrganisations: String(orgId) } },
      { new: true },
    );

    // Remove userId from org's followers
    const updatedOrg = await this.userModel.findByIdAndUpdate(
      orgId,
      { $pull: { followers: String(userId) } },
      { new: true },
    );

    const followersCount = (updatedOrg?.followers || []).length;

    return {
      success: true,
      isFollowing: false,
      followersCount,
      organisationId: orgId,
      message: `Successfully unfollowed ${org.name}`,
    };
  }

  async toggleFollow(userId: string, orgId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentlyFollowing = (user.followedOrganisations || []).some(
      (id) => String(id) === String(orgId),
    );

    if (isCurrentlyFollowing) {
      return await this.unfollowOrganisation(userId, orgId);
    } else {
      return await this.followOrganisation(userId, orgId);
    }
  }

  async getFollowStatus(orgId: string, userId?: string) {
    const org = await this.userModel.findById(orgId);
    if (!org) {
      throw new NotFoundException('Organisation not found');
    }

    const followers = org.followers || [];
    const followersCount = followers.length;

    let isFollowing = false;
    if (userId) {
      const user = await this.userModel.findById(userId);
      if (user) {
        const followed = user.followedOrganisations || [];
        isFollowing = followed.some((id) => String(id) === String(orgId));
      }
    }

    return {
      isFollowing,
      followersCount,
      organisationId: orgId,
    };
  }

  async getFollowedOrganisations(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const followedIds = user.followedOrganisations || [];
    const orgs = await this.userModel
      .find({ _id: { $in: followedIds } })
      .select('-password');

    return {
      followedOrganisations: followedIds,
      organisations: orgs,
    };
  }
}
