import { Injectable } from '@nestjs/common';

import mongoose, { Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Canvas } from './canvas.schema';
import { CanvasDto } from './canvas.dto';

@Injectable()
export class CanvasService {
  constructor(
    @InjectModel(Canvas.name)
    private canvasModel: Model<Canvas>,
    @InjectConnection() private connection: mongoose.Connection,
  ) {}

  async create(data: CanvasDto): Promise<Canvas> {
    const canvas = new this.canvasModel({ ...data, maxZIndex: 1000 });
    return canvas.save();
  }

  async findAll(): Promise<Canvas[]> {
    return this.canvasModel.find().exec();
  }

  findOne(id: string) {
    return this.canvasModel.findById(id).exec();
  }
}
