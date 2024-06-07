import { Module } from '@nestjs/common';
import { DataResourcePropertiesService } from './data-resource-properties.service';
import { DataResourcePropertiesGateway } from './data-resource-properties.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DataResource,
  DataResourceSchema,
} from '../data-resources/data-ressource.schema';
import {
  DataResourceProperty,
  DataResourcePropertySchema,
} from './data-resource-property.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DataResource.name, schema: DataResourceSchema },
      { name: DataResourceProperty.name, schema: DataResourcePropertySchema },
    ]),
  ],
  providers: [DataResourcePropertiesGateway, DataResourcePropertiesService],
})
export class DataResourcePropertiesModule {}
