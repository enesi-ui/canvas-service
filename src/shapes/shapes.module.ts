import { Module } from '@nestjs/common';
import { ShapesService } from './shapes.service';
import { ShapesController } from './shapes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MainComponent,
  MainComponentSchema,
} from '../main-components/main-component.schema';
import { Shape, ShapeSchema } from './shape.schema';
import { ShapesGateway } from './shapes.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MainComponent.name, schema: MainComponentSchema },
      { name: Shape.name, schema: ShapeSchema },
    ]),
  ],
  controllers: [ShapesController],
  providers: [ShapesService, ShapesGateway],
  exports: [ShapesService],
})
export class ShapesModule {}
