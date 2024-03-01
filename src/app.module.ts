import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MainComponentsModule } from './main-components/main-components.module';
import { ShapesModule } from './shapes/shapes.module';
import { ComponentInstancesModule } from './component-instances/component-instances.module';
import { ComponentPropertiesModule } from './component-properties/component-properties.module';
import { DataResourcesModule } from './data-resources/data-resources.module';
import { DataResourcePropertiesModule } from './data-resource-properties/data-resource-properties.module';
import { VariantModule } from './variant/variant.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/enesi'),
    MainComponentsModule,
    ShapesModule,
    ComponentInstancesModule,
    ComponentPropertiesModule,
    DataResourcesModule,
    DataResourcePropertiesModule,
    VariantModule,
  ],
})
export class AppModule {}
