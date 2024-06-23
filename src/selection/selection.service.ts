import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Selection } from './selection.schema';
import { Model } from 'mongoose';
import { UpdateSelectionDto } from './selection.dto';
import { Shape } from '../shapes/shape.schema';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SelectionService {
  constructor(
    @InjectModel(Selection.name)
    private selectionModel: Model<Selection>,
    @InjectModel(Shape.name)
    private shapeModel: Model<Shape>,
  ) {}

  async find(canvasId: string) {
    const selections = await this.selectionModel.find({ canvasId }).exec();
    return {
      canvasId,
      shapeIds: selections.map((selection) => selection.shape.toString()),
    };
  }

  async update(updateSelectionDto: UpdateSelectionDto) {
    if (updateSelectionDto.deselectAll) {
      await this.selectionModel
        .deleteMany({ canvasId: updateSelectionDto.canvasId })
        .exec();
    } else {
      await Promise.all(
        updateSelectionDto.deselectShapes.map(async (shapeId) => {
          const selection = await this.selectionModel
            .findOne({
              shape: shapeId,
            })
            .exec();
          if (selection && selection.canvasId !== updateSelectionDto.canvasId)
            throw new WsException('Selected by another canvas');

          const shape = await this.shapeModel.findById(shapeId).exec();
          return this.selectionModel
            .findOneAndDelete({
              canvasId: updateSelectionDto.canvasId,
              shape,
            })
            .exec();
        }),
      );
    }
    const selections = await Promise.all(
      updateSelectionDto.selectShapes.map(async (shapeId) => {
        const selection = await this.selectionModel
          .findOne({
            shape: shapeId,
          })
          .exec();
        if (selection && selection.canvasId !== updateSelectionDto.canvasId)
          throw new WsException('Selected by another canvas');

        const shape = await this.shapeModel.findById(shapeId).exec();
        return this.selectionModel.create({
          canvasId: updateSelectionDto.canvasId,
          shape,
        });
      }),
    );

    return {
      canvasId: updateSelectionDto.canvasId,
      shapeIds: selections.map((selection) => selection.shape.id),
    };
  }
}
