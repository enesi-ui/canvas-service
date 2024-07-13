import { Injectable } from '@nestjs/common';

import { ShapesService } from '../shapes/shapes.service';
import { UpdateObjectDto, UpdateZIndexObjectDto } from './objects.dto';
import { EnesiObject } from './object';
import mongoose from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { CanvasService } from '../canvas/canvas.service';

@Injectable()
export class ObjectsService {
  constructor(
    private shapeService: ShapesService,
    private canvasService: CanvasService,
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
    const { id, canvasId, belowObject, onBottom, onTop } =
      updateZIndexObjectDto;
    // either aboveObjectId or belowObjectId must be provided
    if (!belowObject && !onTop && !onBottom) {
      throw new Error(
        'Either belowObject or onTop or onBottom must be provided',
      );
    }

    if (onTop) {
      if (!canvasId) {
        throw new Error('CanvasId must be provided');
      }
    }

    if (onBottom) {
      if (!canvasId) {
        throw new Error('CanvasId must be provided');
      }
    }

    const toUpdateZIndex = [];

    const session = await this.connection.startSession();
    const objects = await session.withTransaction(async () => {
      if (onTop) {
        const canvas = await this.canvasService.findOne(canvasId);

        await this.canvasService.updateMaxZIndex(canvasId, session);

        toUpdateZIndex.push({
          id,
          zIndex: canvas.maxZIndex + 1,
        });
      }

      if (onBottom) {
        const canvas = await this.canvasService.findOne(canvasId);

        await this.canvasService.updateMinZIndex(canvasId, session);

        toUpdateZIndex.push({
          id,
          zIndex: canvas.minZIndex - 1,
        });
      }

      if (belowObject) {
        const objectsBelow = await this.shapeService.findAllBelow(
          belowObject,
          id,
        );
        const foundBelowObject = await this.shapeService.findOne(belowObject);

        const updatedZIndices = objectsBelow.map((object) => {
          return { id: object.id, zIndex: object.zIndex - 1 };
        });

        const updateCurrentZIndex = {
          id,
          zIndex: foundBelowObject.zIndex - 1,
        };

        toUpdateZIndex.push(updateCurrentZIndex, ...updatedZIndices);
      }

      return await this.shapeService.updateZIndex(toUpdateZIndex, session);
    });

    await session.endSession();
    return objects;
  }

  update(data: UpdateObjectDto) {
    return this.shapeService.update(data);
  }
}
