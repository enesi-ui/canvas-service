import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {Canvas} from "../canvas/canvas.schema";

export type ShapeDocument = HydratedDocument<Shape>;

export enum ShapeType {
  ELLIPSE = 'ELLIPSE',
  RECTANGLE = 'RECTANGLE',
}

export class ContainerType {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class StrokesType {
  color: string;
  alpha: number;
  width: number;
}

export class FillsType {
  color: string;
  alpha: number;
}

@Schema({ id: true, toJSON: { virtuals: true } })
export class Shape {
  @Prop({ required: true })
  type: ShapeType;

  @Prop({ required: true, type: ContainerType })
  container: ContainerType;

  @Prop({ required: true, type: ContainerType })
  graphics: ContainerType;

  @Prop({ required: true, type: StrokesType })
  strokes: StrokesType;

  @Prop({ required: true, type: FillsType })
  fills: FillsType;

  @Prop({ required: true })
  radius: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  zIndex: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Canvas', required: true })
  canvas: Canvas;

  id: string;
}

export const ShapeSchema = SchemaFactory.createForClass(Shape);
