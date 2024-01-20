import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MainComponent } from '../main-components/main-component.schema';

export type ComponentPropertyDocument = HydratedDocument<ComponentProperty>;

export enum ComponentPropertyType {
  TEXT = 'TEXT',
  BOOLEAN = 'BOOLEAN',
}

@Schema()
export class ComponentProperty {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shape', required: true })
  shape: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MainComponent',
    required: true,
  })
  mainComponent: MainComponent;

  @Prop({ required: true })
  value: string;

  @Prop({ type: String, enum: ComponentPropertyType, required: true })
  type: ComponentPropertyType;
}

export const ComponentPropertySchema =
  SchemaFactory.createForClass(ComponentProperty);
