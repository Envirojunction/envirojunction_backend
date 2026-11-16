import { Controller, Get, UseGuards, Request, Param,
  Patch, Body, Query} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    return await this.usersService.findById(req.user.userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateOwnProfile(
    @Request() req: any,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return await this.usersService.updateProfile(
      req.user.userId,
      updateUserProfileDto,
    );
  }

  @Get()
  async getAllUsers(@Query() query: any) {
    return await this.usersService.findAll(query);
  }

  @Patch(':id/profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return await this.usersService.updateProfile(
      id,
      updateUserProfileDto,
    );
  }

}
