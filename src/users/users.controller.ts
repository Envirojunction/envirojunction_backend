import { Controller, Get, Post, UseGuards, Request, Param,
  Patch, Body, Query} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './schemas/user.schema';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    return await this.usersService.findById(req.user.userId);
  }

  @Get('followed-organisations')
  @UseGuards(JwtAuthGuard)
  async getFollowedOrganisations(@Request() req: any) {
    return await this.usersService.getFollowedOrganisations(req.user.userId);
  }

  @Get('follow-status/:id')
  async getFollowStatus(
    @Param('id') orgId: string,
    @Request() req: any,
    @Query('userId') queryUserId?: string,
  ) {
    let currentUserId = queryUserId;
    const authHeader = req.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        if (token && token.includes('.')) {
          const payload = JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString('utf8'),
          );
          if (payload?.sub || payload?.userId) {
            currentUserId = payload.sub || payload.userId;
          }
        }
      } catch (_) {}
    }
    return await this.usersService.getFollowStatus(orgId, currentUserId);
  }

  @Post('follow/:id')
  @UseGuards(JwtAuthGuard)
  async followOrganisation(
    @Request() req: any,
    @Param('id') orgId: string,
  ) {
    return await this.usersService.followOrganisation(req.user.userId, orgId);
  }

  @Post('unfollow/:id')
  @UseGuards(JwtAuthGuard)
  async unfollowOrganisation(
    @Request() req: any,
    @Param('id') orgId: string,
  ) {
    return await this.usersService.unfollowOrganisation(req.user.userId, orgId);
  }

  @Post('toggle-follow/:id')
  @UseGuards(JwtAuthGuard)
  async toggleFollow(
    @Request() req: any,
    @Param('id') orgId: string,
  ) {
    return await this.usersService.toggleFollow(req.user.userId, orgId);
  }

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  async followOrganisationAlias(
    @Request() req: any,
    @Param('id') orgId: string,
  ) {
    return await this.usersService.toggleFollow(req.user.userId, orgId);
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

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.findById(id);
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

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateRole(
    @Param('id') id: string,
    @Body('role') role: string,
  ) {
    return await this.usersService.updateRole(id, role);
  }
}
