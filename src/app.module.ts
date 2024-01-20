import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MainComponentsModule } from './main-components/main-components.module';
import { ShapesModule } from './shapes/shapes.module';
import { ComponentInstancesModule } from './component-instances/component-instances.module';
import { ComponentPropertiesModule } from './component-properties/component-properties.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/enesi'),
    MainComponentsModule,
    ShapesModule,
    ComponentInstancesModule,
    ComponentPropertiesModule,
  ],
})
export class AppModule {}
