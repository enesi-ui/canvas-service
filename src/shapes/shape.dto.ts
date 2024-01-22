import {IsEnum, IsNumber, IsString, ValidateNested} from 'class-validator';
import { ShapeType } from './shape.schema';
import { Type } from 'class-transformer';

export class StrokePropertyDto {
  color: string;
  alpha: number;
  width: number;
}

export class BoxDto {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class CreateShapeDto {
  @IsEnum(ShapeType)
  type: ShapeType;

  @IsString()
  fill: string;

  @IsNumber()
  fillAlpha: number;

  @ValidateNested({ each: true })
  @Type(() => StrokePropertyDto)
  strokes: StrokePropertyDto[];

  // todo -> test and schema
  @ValidateNested()
  @Type(() => BoxDto)
  container: BoxDto;

  @ValidateNested()
  @Type(() => BoxDto)
  graphics: BoxDto;
}

export class UpdateShapeDto {
  @IsString()
  id: string;

  @IsString()
  fill: string;

  @IsString()
  fillAlpha: number;
}
