import { Injectable } from '@nestjs/common';
import {
  CreateDataRessourceDto,
  UpdateDataRessourceDto,
} from './data-resource.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataResource } from './data-ressource.schema';
@Injectable()
export class DataResourcesService {
  constructor(
    @InjectModel(DataResource.name)
    private dataResourceModel: Model<DataResource>,
  ) {}
  create(createDataResourceDto: CreateDataRessourceDto) {
    const dataResource = new this.dataResourceModel(createDataResourceDto);
    return dataResource.save();
  }

  findAll() {
    return this.dataResourceModel.find().exec();
  }

  findOne(id: string) {
    return this.dataResourceModel.findById(id).exec();
  }

  update(id: string, updateDateResourceDto: UpdateDataRessourceDto) {
    return this.dataResourceModel.findByIdAndUpdate(id, updateDateResourceDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.dataResourceModel.findByIdAndDelete(id).exec();
  }
}
