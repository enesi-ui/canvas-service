import { Injectable } from '@nestjs/common';
import {
  CreateComponentInstanceDto,
  UpdateComponentInstanceDto,
} from './component-instance.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MainComponent } from '../main-components/main-component.schema';
import { Model } from 'mongoose';
import { Shape } from '../shapes/shape.schema';
import { ComponentInstance } from './component-instance.schema';

@Injectable()
export class ComponentInstancesService {
  constructor(
    @InjectModel(ComponentInstance.name)
    private componentInstanceModel: Model<ComponentInstance>,
    @InjectModel(MainComponent.name)
    private mainComponentModel: Model<MainComponent>,
    @InjectModel(Shape.name)
    private shapeModel: Model<Shape>,
  ) {}
  async create(createComponentInstanceDto: CreateComponentInstanceDto) {
    const { shapeId, mainComponentId, ...data } = createComponentInstanceDto;
    const shape = await this.shapeModel.findById(shapeId).exec();
    const mainComponent = await this.mainComponentModel
      .findById(mainComponentId)
      .exec();
    const componentInstance = new this.componentInstanceModel({
      ...data,
      mainComponent,
      shape,
    });
    return componentInstance.save();
  }

  findAll() {
    return this.componentInstanceModel.find().exec();
  }

  findOne(id: number) {
    return this.componentInstanceModel.findById(id).exec();
  }

  update(id: number, updateComponentInstanceDto: UpdateComponentInstanceDto) {
    return this.mainComponentModel
      .findByIdAndUpdate(id, updateComponentInstanceDto, {
        new: true,
      })
      .exec();
  }

  remove(id: number) {
    return this.mainComponentModel.findByIdAndDelete(id).exec();
  }
}
