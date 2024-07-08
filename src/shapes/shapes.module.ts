import { Module } from '@nestjs/common';
import { ShapesService } from './shapes.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MainComponent,
  MainComponentSchema,
} from '../main-components/main-component.schema';
import { Shape, ShapeSchema } from './shape.schema';
import { ShapesGateway } from './shapes.gateway';
import { Canvas, CanvasSchema } from '../canvas/canvas.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MainComponent.name, schema: MainComponentSchema },
      { name: Shape.name, schema: ShapeSchema },
      { name: Canvas.name, schema: CanvasSchema },
    ]),
  ],
  providers: [ShapesService, ShapesGateway],
  exports: [ShapesService],
})
export class ShapesModule {}
