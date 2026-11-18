import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole, UserStatus } from '../users/schemas/user.schema';
import { SignUpDto } from '../users/dto/signup.dto';
import { LoginDto } from '../users/dto/login.dto';
import { OrganisationSignUpDto } from './dto/organisation-signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const { email, password, name, role = UserRole.USER, organisationDetails } = signUpDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await this.userModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || UserRole.USER,
      organisationDetails: organisationDetails || undefined,
    });

    // Generate JWT token including role
    const token = this.jwtService.sign(
      {
        sub: newUser._id.toString(),
        email: newUser.email,
        role: newUser.role,
      },
      { expiresIn: '7h' },
    );

    return {
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        organisationDetails: newUser.organisationDetails,
      },
    };
  }

  async signupOrganisation(dto: OrganisationSignUpDto) {
    const {
      name,
      email,
      password,
      expertise,
      companySize,
      primaryUseCase,
      website,
      linkedin,
      about,
      logo,
      gstNumber,
      cinNumber,
      organisationDetails,
    } = dto;

    const normalizedEmail = email.toLowerCase().trim();

    // Check if organisation email already exists
    const existingOrg = await this.userModel.findOne({ email: normalizedEmail });
    if (existingOrg) {
      throw new BadRequestException('Work email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Consolidated organisation details
    const orgData = {
      companyName: name.trim(),
      expertise: expertise || organisationDetails?.expertise || [],
      companySize: companySize || organisationDetails?.companySize || '',
      primaryUseCase: primaryUseCase || organisationDetails?.primaryUseCase || '',
      website: website || organisationDetails?.website || '',
      linkedin: linkedin || organisationDetails?.linkedin || '',
      about: about || organisationDetails?.about || '',
      logo: logo || organisationDetails?.logo || '',
      gstNumber: gstNumber || organisationDetails?.gstNumber || '',
      cinNumber: cinNumber || organisationDetails?.cinNumber || '',
    };

    const newOrg = await this.userModel.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: UserRole.ORGANISATION,
      avatar: orgData.logo || undefined,
      about: orgData.about || undefined,
      organisationDetails: orgData,
      status: UserStatus.ACTIVE,
    });

    const token = this.jwtService.sign(
      {
        sub: newOrg._id.toString(),
        email: newOrg.email,
        role: newOrg.role,
      },
      { expiresIn: '7h' },
    );

    return {
      message: 'Organisation registered successfully',
      token,
      user: {
        id: newOrg._id,
        name: newOrg.name,
        email: newOrg.email,
        role: newOrg.role,
        status: newOrg.status,
        avatar: newOrg.avatar,
        organisationDetails: newOrg.organisationDetails,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token with role
    const token = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
      role: user.role || UserRole.USER,
    });

    return {
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || UserRole.USER,
        status: user.status,
        avatar: user.avatar,
        title: user.title,
        headline: user.headline,
        organisationDetails: user.organisationDetails,
      },
    };
  }

  async socialLogin(socialDto: {
    email: string;
    name: string;
    provider?: string;
    avatar?: string;
    providerId?: string;
    role?: UserRole;
  }) {
    const { email, name, avatar, role = UserRole.USER } = socialDto;
    const normalizedEmail = email.toLowerCase().trim();

    let user = await this.userModel.findOne({ email: normalizedEmail });
    if (!user) {
      const randomPassword = await bcrypt.hash(
        Math.random().toString(36).slice(-8) + Date.now().toString(36),
        10,
      );
      user = await this.userModel.create({
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        password: randomPassword,
        avatar: avatar || undefined,
        role: role || UserRole.USER,
        status: UserStatus.ACTIVE,
      });
    } else if (avatar && !user.avatar) {
      user.avatar = avatar;
      await user.save();
    }

    const token = this.jwtService.sign(
      {
        sub: user._id.toString(),
        email: user.email,
        role: user.role || UserRole.USER,
      },
      { expiresIn: '7h' },
    );

    return {
      message: 'Social login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || UserRole.USER,
        status: user.status,
        avatar: user.avatar,
        title: user.title,
        headline: user.headline,
        organisationDetails: user.organisationDetails,
      },
    };
  }
}
