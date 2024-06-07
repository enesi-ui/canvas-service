import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MainComponent } from '../main-components/main-component.schema';

export type VariantDocument = HydratedDocument<Variant>;

@Schema({ id: true, toJSON: { virtuals: true } })
export class Variant {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MainComponent',
    required: true,
    unique: true,
  })
  component: MainComponent;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);
