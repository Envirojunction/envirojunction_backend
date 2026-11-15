import { Controller, Get, UseGuards, Request, Param,
  Patch, Body} from '@nestjs/common';
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

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return await this.usersService.findAll();
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
