import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DataResourceDocument = HydratedDocument<DataResource>;

class Container {
  x: number;
  y: number;
}
@Schema()
export class DataResource {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Container })
  container: {
    x: number;
    y: number;
  };
}

export const DataResourceSchema = SchemaFactory.createForClass(DataResource);
