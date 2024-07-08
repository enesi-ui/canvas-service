import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Shape } from '../shapes/shape.schema';
import { Canvas } from '../canvas/canvas.schema';

export type SelectionDocument = HydratedDocument<Selection>;

@Schema({ id: true, toJSON: { virtuals: true } })
export class Selection {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shape',
    required: true,
  })
  shape: Shape;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Canvas', required: true })
  canvas: Canvas;

  id: string;
}

export const SelectionSchema = SchemaFactory.createForClass(Selection);
