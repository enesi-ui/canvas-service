import { Injectable } from '@nestjs/common';
import { CreateShapeDto, UpdateShapeDto } from './shape.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { MainComponent } from '../main-components/main-component.schema';
import mongoose, { Model } from 'mongoose';
import { Shape } from './shape.schema';
import { Canvas } from '../canvas/canvas.schema';

@Injectable()
export class ShapesService {
  constructor(
    @InjectModel(Shape.name)
    private shapeModel: Model<Shape>,
    @InjectModel(Canvas.name)
    private canvasModel: Model<Canvas>,
    @InjectModel(MainComponent.name)
    private mainComponentModel: Model<MainComponent>,
    @InjectConnection() private connection: mongoose.Connection,
  ) {}

  async create(createShapeDto: CreateShapeDto) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const canvas = await this.canvasModel
        .findById(createShapeDto.canvasId)
        .session(session)
        .exec();

      const minZIndex = canvas.minZIndex - 1;

      const shape = new this.shapeModel({
        ...createShapeDto,
        zIndex: minZIndex,
        canvas,
      });

      await canvas.updateOne({ minZIndex }).session(session).exec();

      const newShape = await shape.save({ session });

      await session.commitTransaction();

      return newShape;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  findAll(canvasId: string, sortByZIndex = false, excludeId?: string) {
    const query = {
      canvas: canvasId,
    };

    if (excludeId) {
      query['_id'] = { $ne: excludeId };
    }

    return sortByZIndex
      ? this.shapeModel.find(query).sort({ zIndex: 1 }).exec()
      : this.shapeModel.find(query).exec();
  }

  findOne(id: string) {
    return this.shapeModel.findById(id).exec();
  }

  async findAllAbove(id: string, canvasId, excludeId?: string) {
    const shape = await this.shapeModel.findById(id).exec();
    if (!shape) {
      return [];
    }
    const query = { zIndex: { $gt: shape.zIndex } };
    if (excludeId) {
      query['_id'] = { $ne: excludeId };
    }
    return this.shapeModel.find(query).exec();
  }

  async getMainComponent(id: string) {
    return await this.mainComponentModel.findOne({ shape: id }).exec();
  }

  update(updateShapeDto: UpdateShapeDto) {
    const { id, ...data } = updateShapeDto;
    return this.shapeModel
      .findByIdAndUpdate(id, data, {
        new: true,
      })
      .exec();
  }

  remove(id: string) {
    return this.shapeModel.findByIdAndDelete(id).exec();
  }

  async updateZIndex(
    shapes: { id: any; zIndex: number }[],
    session: mongoose.ClientSession,
  ) {
    return Promise.all(
      shapes.map((shape) =>
        this.shapeModel
          .findByIdAndUpdate(shape.id, { zIndex: shape.zIndex }, { new: true })
          .session(session)
          .exec(),
      ),
    );
  }

  async findTop() {
    return this.shapeModel.findOne().sort({ zIndex: -1 }).exec();
  }

  async findBottom() {
    return this.shapeModel.findOne().sort({ zIndex: 1 }).exec();
  }
}
