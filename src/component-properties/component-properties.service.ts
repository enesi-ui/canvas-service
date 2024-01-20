import { Injectable } from '@nestjs/common';
import {
  CreateComponentPropertyDto,
  UpdateComponentPropertyDto,
} from './component-property.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MainComponent } from '../main-components/main-component.schema';
import { Model } from 'mongoose';
import { ComponentProperty } from './component-property.schema';

@Injectable()
export class ComponentPropertiesService {
  constructor(
    @InjectModel(MainComponent.name)
    private mainComponentModel: Model<MainComponent>,
    @InjectModel(ComponentProperty.name)
    private componentProperty: Model<ComponentProperty>,
  ) {}

  create(createComponentPropertyDto: CreateComponentPropertyDto) {
    const { mainComponentId, ...data } = createComponentPropertyDto;
    const mainComponent = this.mainComponentModel.findById(mainComponentId);
    const componentProperty = new this.componentProperty({
      ...data,
      mainComponent,
    });
    return componentProperty.save();
  }

  findAll() {
    return this.componentProperty.find().exec();
  }

  findAllByMainComponentId(mainComponentId: string) {
    return this.componentProperty
      .find({ mainComponent: mainComponentId })
      .exec();
  }

  findOne(id: string) {
    return this.componentProperty.findById(id).exec();
  }

  update(updateComponentPropertyDto: UpdateComponentPropertyDto) {
    const { id, ...data } = updateComponentPropertyDto;
    return this.componentProperty
      .findByIdAndUpdate(id, data, {
        new: true,
      })
      .exec();
  }

  remove(id: string) {
    return this.componentProperty.findByIdAndDelete(id).exec();
  }
}
