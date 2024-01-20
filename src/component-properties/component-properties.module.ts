import { Module } from '@nestjs/common';
import { ComponentPropertiesService } from './component-properties.service';
import { ComponentPropertiesController } from './component-properties.controller';
import { ComponentPropertiesGateway } from './component-properties.gateway';
import {
  MainComponent,
  MainComponentSchema,
} from '../main-components/main-component.schema';
import {
  ComponentProperty,
  ComponentPropertySchema,
} from './component-property.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MainComponent.name, schema: MainComponentSchema },
      { name: ComponentProperty.name, schema: ComponentPropertySchema },
    ]),
  ],
  controllers: [ComponentPropertiesController],
  providers: [ComponentPropertiesService, ComponentPropertiesGateway],
})
export class ComponentPropertiesModule {}
