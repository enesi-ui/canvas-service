import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DataResource } from '../data-resources/data-ressource.schema';

export type DataResourcePropertyDocument =
  HydratedDocument<DataResourceProperty>;

export enum DataResourcePropertyType {
  LOCAL = 'LOCAL',
  REMOTE = 'REMOTE',
}

@Schema()
export class DataResourceProperty {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  value: string;

  @Prop()
  url?: string;

  @Prop({ type: String, enum: DataResourcePropertyType, required: true })
  type: DataResourcePropertyType;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DataResource',
    required: true,
  })
  dataResource: DataResource;
}

export const DataResourcePropertySchema =
  SchemaFactory.createForClass(DataResourceProperty);
