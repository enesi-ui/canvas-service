import { Module } from '@nestjs/common';
import { DataResourcesService } from './data-resources.service';
import { DataResourcesController } from './data-resources.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DataResource, DataResourceSchema } from './data-ressource.schema';
import { DataResourcesGateway } from './data-resources.gateway';

@Module({
  controllers: [DataResourcesController],
  providers: [DataResourcesService, DataResourcesGateway],
  imports: [
    MongooseModule.forFeature([
      { name: DataResource.name, schema: DataResourceSchema },
    ]),
  ],
})
export class DataResourcesModule {}
