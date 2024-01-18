import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShapeDocument = HydratedDocument<Shape>;

export enum ShapeType {
  ELLIPSE = 'ELLIPSE',
  RECTANGLE = 'RECTANGLE',
}

@Schema()
export class Shape {
  @Prop({ required: true })
  type: ShapeType;

  @Prop({ required: true })
  fill: string;

  @Prop({ required: true })
  fillAlpha: number;
}

export const ShapeSchema = SchemaFactory.createForClass(Shape);
