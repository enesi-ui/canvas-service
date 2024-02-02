import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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

@Schema({ id: true, toJSON: { virtuals: true } })
export class Shape {
  @Prop({ required: true })
  type: ShapeType;

  @Prop({ required: true })
  fill: string;

  @Prop({ required: true })
  fillAlpha: number;

  @Prop({ required: true, type: ContainerType })
  container: ContainerType;

  @Prop({ required: true, type: ContainerType })
  graphics: ContainerType;

  @Prop({ required: true, type: StrokesType })
  strokes: StrokesType;

  id: string;
}

export const ShapeSchema = SchemaFactory.createForClass(Shape);
