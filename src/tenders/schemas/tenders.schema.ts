import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TenderDocument = HydratedDocument<Tender>;

@Schema({ timestamps: true })
export class Tender {
  @Prop({ type: String, required: false })
  url: string;

  @Prop({ type: String, required: false })
  organisation: string;

  @Prop({ type: String, required: false })
  title: string;

  @Prop({ type: String, required: false })
  tender_id: string;

  @Prop({ type: String, required: false })
  reference_number?: string;

  @Prop({ type: String, required: false })
  authority_type: string;

  @Prop({ type: String, required: false })
  sector: string;

  @Prop({ type: String, required: false })
  location: string;

  @Prop({ type: String, required: false })
  value?: string;

  @Prop({ type: String, required: false })
  emd?: string;

  @Prop({ type: String, required: false })
  tender_fee?: string;

  @Prop({ type: String, required: false })
  publication_date: string;

  @Prop({ type: String, required: false })
  deadline?: string;

  @Prop({ type: String, required: false })
  days_remaining?: string;

  @Prop({ type: String, required: false })
  bid_validity?: string;

  @Prop({ type: String, required: false })
  contract_duration?: string;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: String, required: false })
  scope_of_work: string;

  @Prop({ type: String, required: false })
  eligibility?: string;

  @Prop({ type: String, required: false })
  documents_required?: string;

  @Prop({ type: String, required: false })
  payment_terms?: string;

  @Prop({ type: String, required: false })
  performance_security?: string;

  @Prop({ type: String, required: false })
  document_url: string;

  @Prop({ type: String, required: false })
  tender_status: string;

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

export const TenderSchema = SchemaFactory.createForClass(Tender);