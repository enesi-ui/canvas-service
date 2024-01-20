import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsString } from 'class-validator';
import { ShapeType } from './shape.schema';

export class CreateShapeDto {
  @IsEnum(ShapeType)
  type: ShapeType;

  @IsString()
  fill: string;

  @IsString()
  fillAlpha: number;
}

export class UpdateShapeDto {
  @IsString()
  id: string;

  @IsString()
  fill: string;

  @IsString()
  fillAlpha: number;
}
