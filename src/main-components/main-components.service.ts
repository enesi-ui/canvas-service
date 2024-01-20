import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MainComponent } from './main-component.schema';
import { Model } from 'mongoose';
import {
  CreateMainComponentDto,
  UpdateMainComponentDto,
} from './main-component.dto';
import { Shape } from '../shapes/shape.schema';

@Injectable()
export class MainComponentsService {
  constructor(
    @InjectModel(MainComponent.name)
    private mainComponentModel: Model<MainComponent>,
    @InjectModel(Shape.name)
    private shapeModel: Model<Shape>,
  ) {}

  async create(createCatDto: CreateMainComponentDto): Promise<MainComponent> {
    const { shapeId, ...data } = createCatDto;
    const shape = await this.shapeModel.findById(shapeId).exec();
    const mainComponent = new this.mainComponentModel({ ...data, shape });
    return mainComponent.save();
  }

  async findAll(): Promise<MainComponent[]> {
    return this.mainComponentModel.find().exec();
  }

  async findOne(id: string): Promise<MainComponent> {
    return this.mainComponentModel.findById(id).exec();
  }

  async delete(id: string): Promise<MainComponent> {
    return await this.mainComponentModel.findByIdAndDelete(id).exec();
  }

  update(updateComponentDto: UpdateMainComponentDto) {
    const { id, ...data } = updateComponentDto;
    return this.mainComponentModel
      .findByIdAndUpdate(id, data, {
        new: true,
      })
      .exec();
  }
}
