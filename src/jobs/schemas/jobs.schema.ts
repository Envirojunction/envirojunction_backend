import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job {
  @Prop({ type: String, required: false })
  url: string;

  @Prop({ type: String, required: false })
  organisation?: string;

  @Prop({ type: String, required: false })
  title?: string;

  @Prop({ type: String, required: false })
  location?: string;

  @Prop({ type: String, required: false })
  job_type?: string;

  @Prop({ type: String, required: false })
  deadline?: string;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: String, required: false })
  responsibilities?: string;

  @Prop({ type: String, required: false })
  requirements?: string;

  @Prop({ type: String, required: false })
  how_to_apply?: string;

  @Prop({ type: String, required: false })
  additional_info?: string;

  @Prop({ type: String, required: false })
  date_posted?: string;

  @Prop({ type: String, required: false })
  attachment_url?: string;

  @Prop({ type: String, required: false })
  job_status?: string;

  @Prop({ type: String, required: false })
  last_checked: string;

  @Prop({ type: String, required: false })
  source_url: string;

  @Prop({ type: String, required: false })
  full_content_html: string;

  @Prop({ type: String, required: false })
  expiration_date?: string;

  @Prop({ type: String, required: false })
  is_expired: string;

  @Prop({ type: String, required: false })
  availability_note: string;

}

export const JobSchema = SchemaFactory.createForClass(Job);