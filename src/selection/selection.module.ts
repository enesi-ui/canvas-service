import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Selection, SelectionSchema } from './selection.schema';
import { Shape, ShapeSchema } from '../shapes/shape.schema';
import { SelectionService } from './selection.service';
import { SelectionGateway } from './selection.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Selection.name, schema: SelectionSchema },
      { name: Shape.name, schema: ShapeSchema },
    ]),
  ],
  providers: [SelectionService, SelectionGateway],
})
export class SelectionModule {}
