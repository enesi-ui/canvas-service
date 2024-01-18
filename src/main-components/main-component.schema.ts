import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Shape } from '../shapes/shape.schema';

export type MainComponentDocument = HydratedDocument<MainComponent>;

@Schema()
export class MainComponent {
  @Prop({ default: 'main' })
  type: 'main' | 'instance';

  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shape', required: true })
  shape: Shape;
}

export const MainComponentSchema = SchemaFactory.createForClass(MainComponent);
