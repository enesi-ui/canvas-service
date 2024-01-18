import { Module } from '@nestjs/common';
import { ComponentInstancesService } from './component-instances.service';
import { ComponentInstancesController } from './component-instances.controller';

@Module({
  controllers: [ComponentInstancesController],
  providers: [ComponentInstancesService],
})
export class ComponentInstancesModule {}
