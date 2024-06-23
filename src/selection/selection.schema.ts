import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Shape } from '../shapes/shape.schema';

export type SelectionDocument = HydratedDocument<Selection>;

@Schema({ id: true, toJSON: { virtuals: true } })
export class Selection {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shape',
    required: true,
  })
  shape: Shape;

  @Prop({ required: true })
  canvasId: string;

  id: string;
}

export const SelectionSchema = SchemaFactory.createForClass(Selection);
