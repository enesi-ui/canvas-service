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
    return 'This action adds a new dataRessource';
  }

  findAll() {
    return [];
  }

  findOne(id: number) {
    return `This action returns a #${id} dataRessource`;
  }

  update(id: number, updateDateResourceDto: UpdateDataRessourceDto) {
    return `This action updates a #${id} dataRessource`;
  }

  remove(id: number) {
    return `This action removes a #${id} dataRessource`;
  }
}
