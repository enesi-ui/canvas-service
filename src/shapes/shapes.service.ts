import { Injectable } from '@nestjs/common';
import { CreateShapeDto, UpdateShapeDto } from './shape.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MainComponent } from '../main-components/main-component.schema';
import { Model } from 'mongoose';
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

  findAll() {
    return this.shapeModel.find().exec();
  }

  findOne(id: string) {
    return this.shapeModel.findById(id).exec();
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
    console.log('id', id);
    return this.shapeModel.findByIdAndDelete(id).exec();
  }
}
