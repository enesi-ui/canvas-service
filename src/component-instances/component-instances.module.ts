import { Module } from '@nestjs/common';
import { ComponentInstancesService } from './component-instances.service';
import { ComponentInstancesController } from './component-instances.controller';
import { ComponentInstancesGateway } from './component-instances.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MainComponent,
  MainComponentSchema,
} from '../main-components/main-component.schema';
import { Shape, ShapeSchema } from '../shapes/shape.schema';
import {
  ComponentInstance,
  ComponentInstanceSchema,
} from './component-instance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ComponentInstance.name, schema: ComponentInstanceSchema },
      { name: MainComponent.name, schema: MainComponentSchema },
      { name: Shape.name, schema: ShapeSchema },
    ]),
  ],
  controllers: [ComponentInstancesController],
  providers: [ComponentInstancesService, ComponentInstancesGateway],
})
export class ComponentInstancesModule {}
