import { Injectable } from '@nestjs/common';

import { ShapesService } from '../shapes/shapes.service';
import { UpdateObjectDto, UpdateZIndexObjectDto } from './objects.dto';
import { EnesiObject } from './object';
import mongoose from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class ObjectsService {
  constructor(
    private shapeService: ShapesService,
    @InjectConnection() private connection: mongoose.Connection,
  ) {}

  findAll(canvasId: string) {
    return this.shapeService.findAll(canvasId);
  }

  findOne(id: string) {
    return this.shapeService.findOne(id);
  }

  async updateZIndex(
    updateZIndexObjectDto: UpdateZIndexObjectDto,
  ): Promise<EnesiObject[]> {
    const { id, canvasId, aboveObjectId, onBottom, onTop } =
      updateZIndexObjectDto;
    // either aboveObjectId or belowObjectId must be provided
    if (!aboveObjectId && !onTop && !onBottom) {
      throw new Error(
        'Either aboveObjectId or onTop or onBottom must be provided',
      );
    }

    const toUpdateZIndex = [];

    if (onTop) {
      const top = await this.shapeService.findTop();

      toUpdateZIndex.push({
        id,
        zIndex: top.zIndex + 1,
      });
    }

    if (onBottom) {
      const all = await this.shapeService.findAll(canvasId, true, id);

      const updatedZIndices = all.map((object) => {
        return { id: object.id, zIndex: object.zIndex + 1 };
      });

      const updateCurrentZIndex = {
        id,
        zIndex: updatedZIndices[0].zIndex - 1,
      };

      toUpdateZIndex.push(updateCurrentZIndex, ...updatedZIndices);
    }

    if (aboveObjectId) {
      const objectsAbove = await this.shapeService.findAllAbove(
        aboveObjectId,
        canvasId,
        id,
      );
      const aboveObject = await this.shapeService.findOne(aboveObjectId);

      const updatedZIndices = objectsAbove.map((object) => {
        return { id: object.id, zIndex: object.zIndex + 1 };
      });

      const updateCurrentZIndex = {
        id,
        zIndex: aboveObject.zIndex + 1,
      };

      toUpdateZIndex.push(updateCurrentZIndex, ...updatedZIndices);
    }

    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const objects = await this.shapeService.updateZIndex(
        toUpdateZIndex,
        session,
      );
      await session.commitTransaction();
      return objects;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  update(data: UpdateObjectDto) {
    return this.shapeService.update(data);
  }
}
