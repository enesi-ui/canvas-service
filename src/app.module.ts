import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MainComponentsModule } from './main-components/main-components.module';
import { ShapesModule } from './shapes/shapes.module';
import { ComponentInstancesModule } from './component-instances/component-instances.module';

@Module({
  imports: [
    EventsModule,
    MainComponentsModule,
    MongooseModule.forRoot('mongodb://localhost/enesi'),
    ShapesModule,
    ComponentInstancesModule,
  ],
})
export class AppModule {}
