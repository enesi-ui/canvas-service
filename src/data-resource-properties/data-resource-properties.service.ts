import { Injectable } from '@nestjs/common';
import {
  CreateDataResourcePropertyDto,
  UpdateDataResourcePropertyDto,
} from './data-resource-property.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MainComponent } from '../main-components/main-component.schema';
import { Model } from 'mongoose';
import { DataResource } from '../data-resources/data-ressource.schema';
import { DataResourceProperty } from './data-resource-property.schema';

@Injectable()
export class DataResourcePropertiesService {
  constructor(
    @InjectModel(DataResource.name)
    private DataResourceModel: Model<MainComponent>,
    @InjectModel(DataResourceProperty.name)
    private dataResourcePropertyModel: Model<DataResourceProperty>,
  ) {}

  create(createDataResourcePropertyDto: CreateDataResourcePropertyDto) {
    const { dataResourceId, ...data } = createDataResourcePropertyDto;
    this.DataResourceModel.findById(dataResourceId);
    const dataResourceProperty = new this.dataResourcePropertyModel({
      ...data,
      dataResource: dataResourceId,
    });
    return dataResourceProperty.save();
  }

  findAll() {
    return this.dataResourcePropertyModel.find().exec();
  }

  findOne(id: string) {
    return this.dataResourcePropertyModel.findById(id).exec();
  }

  update(updateDataResourcePropertyDto: UpdateDataResourcePropertyDto) {
    const { id, ...data } = updateDataResourcePropertyDto;
    return this.dataResourcePropertyModel
      .findByIdAndUpdate(id, data, {
        new: true,
      })
      .exec();
  }

  remove(id: number) {
    return this.dataResourcePropertyModel.findByIdAndDelete(id).exec();
  }

  findAllByDataResourceId(id: string) {
    return this.dataResourcePropertyModel.find({ dataResource: id }).exec();
  }
}
