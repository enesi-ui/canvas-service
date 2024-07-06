import { Injectable } from '@nestjs/common';
import { CreateShapeDto, UpdateShapeDto } from './shape.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MainComponent } from '../main-components/main-component.schema';
import mongoose, { Model } from 'mongoose';
import { Shape } from './shape.schema';

@Injectable()
export class ShapesService {
  constructor(
    @InjectModel(Shape.name)
    private shapeModel: Model<Shape>,
    @InjectModel(MainComponent.name)
    private mainComponentModel: Model<MainComponent>,
  ) {}

  create(createShapeDto: CreateShapeDto) {
    const shape = new this.shapeModel(createShapeDto);
    return shape.save();
  }

  findAll(sortByZIndex = false, excludeId?: string) {
    const query = {};
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

  async findAllAbove(id: string, excludeId?: string) {
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
