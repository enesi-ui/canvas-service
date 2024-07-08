import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Selection } from './selection.schema';
import { Model } from 'mongoose';
import { UpdateSelectionDto } from './selection.dto';
import { Shape } from '../shapes/shape.schema';
import { WsException } from '@nestjs/websockets';
import { Canvas } from '../canvas/canvas.schema';

@Injectable()
export class SelectionService {
  constructor(
    @InjectModel(Selection.name)
    private selectionModel: Model<Selection>,
    @InjectModel(Canvas.name)
    private canvasModel: Model<Canvas>,
    @InjectModel(Shape.name)
    private shapeModel: Model<Shape>,
  ) {}

  async find(canvasId: string) {
    const canvas = await this.canvasModel.findById(canvasId).exec();
    if (!canvas) throw new WsException('Canvas not found');
    const selections = await this.selectionModel.find({ canvas }).exec();
    return {
      canvasId,
      shapeIds: selections.map((selection) => selection.shape.toString()),
    };
  }

  async update(updateSelectionDto: UpdateSelectionDto) {
    const canvas = await this.canvasModel.findById(updateSelectionDto.canvasId);
    if (!canvas) throw new WsException('Canvas not found');
    if (updateSelectionDto.deselectAll) {
      await this.selectionModel.deleteMany({ canvas }).exec();
    } else {
      await Promise.all(
        updateSelectionDto.deselectShapes.map(async (shapeId) => {
          const selection = await this.selectionModel
            .findOne({
              shape: shapeId,
            })
            .exec();
          if (
            selection &&
            selection.canvas.toString() !== updateSelectionDto.canvasId
          )
            throw new WsException('Selected by another canvas');

          const shape = await this.shapeModel.findById(shapeId).exec();
          return this.selectionModel
            .findOneAndDelete({
              canvas: updateSelectionDto.canvasId,
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
        if (selection && selection.canvas.id !== updateSelectionDto.canvasId)
          throw new WsException('Selected by another canvas');

        const shape = await this.shapeModel.findById(shapeId).exec();
        return this.selectionModel.create({
          canvas,
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
