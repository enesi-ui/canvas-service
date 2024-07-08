import { Module } from '@nestjs/common';
import { ShapesService } from '../shapes/shapes.service';
import { ObjectsService } from './objects.service';
import { ShapesModule } from '../shapes/shapes.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MainComponent,
  MainComponentSchema,
} from '../main-components/main-component.schema';
import { Shape, ShapeSchema } from '../shapes/shape.schema';
import { ObjectsGateway } from './objects.gateway';
import { Canvas, CanvasSchema } from '../canvas/canvas.schema';

@Module({
  imports: [
    ShapesModule,
    MongooseModule.forFeature([
      { name: MainComponent.name, schema: MainComponentSchema },
      { name: Shape.name, schema: ShapeSchema },
      { name: Canvas.name, schema: CanvasSchema },
    ]),
  ],
  providers: [ShapesService, ObjectsService, ObjectsGateway],
})
export class ObjectsModule {}
