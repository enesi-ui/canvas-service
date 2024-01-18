import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MainComponentsService } from './main-components.service';
import { MainComponent, MainComponentSchema } from './main-component.schema';
import { MainComponentsController } from './main-components.controller';
import { Shape, ShapeSchema } from '../shapes/shape.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MainComponent.name, schema: MainComponentSchema },
      { name: Shape.name, schema: ShapeSchema },
    ]),
  ],
  controllers: [MainComponentsController],
  providers: [MainComponentsService],
})
export class MainComponentsModule {}
