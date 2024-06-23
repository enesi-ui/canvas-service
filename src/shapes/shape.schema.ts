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

  @Prop({ required: true })
  canvasId: string;

  id: string;
}

export const ShapeSchema = SchemaFactory.createForClass(Shape);
