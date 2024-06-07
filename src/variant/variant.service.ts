import { Injectable } from '@nestjs/common';
import { CreateVariantDto, UpdateVariantDto } from './variant.dto';
import { Variant } from './variant.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class VariantService {
  constructor(
    @InjectModel(Variant.name)
    private DataResourceModel: Model<Variant>,
  ) {}
  create(createVariantDto: CreateVariantDto) {
    const variant = new this.DataResourceModel(createVariantDto);
    return variant.save();
  }

  findAll() {
    return this.DataResourceModel.find().exec();
  }

  findOne(id: string) {
    return this.DataResourceModel.findById(id).exec();
  }

  update(id: string, updateVariantDto: UpdateVariantDto) {
    return this.DataResourceModel.findByIdAndUpdate(id, updateVariantDto, {
      new: true,
    }).exec();
  }

  remove(id: string) {
    return this.DataResourceModel.findByIdAndDelete(id).exec();
  }
}
