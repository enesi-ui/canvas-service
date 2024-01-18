import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MainComponent } from '../main-components/main-component.schema';

export type ComponentInstanceDocument = HydratedDocument<ComponentInstance>;

@Schema()
export class ComponentInstance {
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
}

export const ComponentInstanceSchema =
  SchemaFactory.createForClass(ComponentInstance);
