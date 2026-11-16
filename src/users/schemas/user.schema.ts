import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail, IsString, MinLength } from 'class-validator';

export type UserDocument = User & Document;

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Schema({ _id: false })
export class Education {
  @Prop()
  title?: string;

  @Prop()
  name?: string;

  @Prop()
  start_year?: number;

  @Prop()
  end_year?: number;
}

export const EducationSchema = SchemaFactory.createForClass(Education);

@Schema({ _id: false })
export class Certification {
  @Prop()
  title?: string;

  @Prop()
  name?: string;

  @Prop()
  start_year?: number;

  @Prop()
  end_year?: number;
}

export const CertificationSchema =
  SchemaFactory.createForClass(Certification);

@Schema({ _id: false })
export class WorkExperience {
  @Prop()
  title?: string;

  @Prop()
  name?: string;

  @Prop()
  start_year?: number;

  @Prop()
  end_year?: number;

  @Prop()
  about?: string;

  @Prop({ default: false })
  isPresent?: boolean;
}

export const WorkExperienceSchema =
  SchemaFactory.createForClass(WorkExperience);


@Schema({ _id: false })
export class Project {
  @Prop()
  name?: string;

  @Prop({
    type: [String],
    default: [],
  })
  tags?: string[];

  @Prop()
  title?: string;

  @Prop()
  projectType?: string;

  @Prop()
  date?: Date;

  @Prop()
  details?: string;

  @Prop()
  status?: string;

  @Prop()
  location?: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  @IsString()
  name!: string;

  @Prop({ required: true, unique: true })
  @IsEmail()
  email!: string;

  @Prop({ required: true })
  @MinLength(6)
  password!: string;

  @Prop({
    default: UserStatus.ACTIVE,
    enum: UserStatus,
  })
  status!: UserStatus;

  @Prop()
  avatar?: string;

  // -------------------------
  // Profile fields
  // -------------------------

  @Prop()
  title?: string;

  @Prop()
  headline?: string;

  @Prop()
  about?: string;

  @Prop()
  skills?: string;

  @Prop({
    type: [String],
    default: [],
  })
  professional_skills?: string[];

  @Prop({
    type: [String],
    default: [],
  })
  services?: string[];

  @Prop({
    type: [EducationSchema],
    default: [],
  })
  education?: Education[];

  @Prop({
    type: [CertificationSchema],
    default: [],
  })
  certifications?: Certification[];

  @Prop({
    type: [WorkExperienceSchema],
    default: [],
  })
  work_experience?: WorkExperience[];

  @Prop()
  location?: string;

  @Prop({
    type: [String],
    default: [],
  })
  sectors?: string[];

  @Prop()
  phone?: string;

  @Prop({
    type: [String],
    default: [],
  })
  languages?: string[];

  @Prop({
    type: [ProjectSchema],
    default: [],
  })
  projects?: Project[];

  // -------------------------
  // Timestamps
  // -------------------------

  @Prop()
  createdAt!: Date;

  @Prop()
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);