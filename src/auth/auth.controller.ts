import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from '../users/dto/signup.dto';
import { LoginDto } from '../users/dto/login.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { OrganisationSignUpDto } from './dto/organisation-signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return await this.authService.signup(signUpDto);
  }

  @Post('signup/organisation')
  async signupOrganisation(@Body() organisationSignUpDto: OrganisationSignUpDto) {
    return await this.authService.signupOrganisation(organisationSignUpDto);
  }

  @Post('organisation-signup')
  async organisationSignup(@Body() organisationSignUpDto: OrganisationSignUpDto) {
    return await this.authService.signupOrganisation(organisationSignUpDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('social-login')
  async socialLogin(@Body() socialDto: SocialLoginDto) {
    return await this.authService.socialLogin(socialDto);
  }

  @Post('social-signup')
  async socialSignup(@Body() socialDto: SocialLoginDto) {
    return await this.authService.socialLogin(socialDto);
  }
}
