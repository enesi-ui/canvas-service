import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CanvasDocument = HydratedDocument<Canvas>;

@Schema({ id: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Canvas {
  @Prop({ required: true })
  maxZIndex: number;

  @Prop({ required: true })
  name: string;

  id: string;
}

export const CanvasSchema = SchemaFactory.createForClass(Canvas);
