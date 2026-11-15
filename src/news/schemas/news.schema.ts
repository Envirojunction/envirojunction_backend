import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsDocument = News & Document;

@Schema({ timestamps: true })
export class News {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: false })
  description!: string;

  @Prop({ required: false })
  content_type!: string;

  @Prop({ required: true })
  category!: string;

  @Prop({ required: false })
  image!: string;

  @Prop({ required: false })
  image_url!: string;

  @Prop({ required: false })
  author!: string;

  @Prop({ required: false })
  source_name!: string;

  @Prop({ required: false })
  domain_category!: string;

  @Prop({ required: false })
  summary!: string;

  @Prop({ required: false })
  read_time!: string;

  @Prop({ required: false })
  tags!: string;
  
  @Prop({ required: false })
  video_url!: string;

  @Prop({ required: false })
  source_url!: string;

  @Prop({ required: false })
  full_content_html!: string;

  @Prop({ required: false })
  status!: string;

  @Prop({ default: Date.now })
  date!: Date;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ default: Date.now })
  updatedAt!: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);
