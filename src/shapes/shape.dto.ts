import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
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

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => StrokePropertyDto)
  strokes: StrokePropertyDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => BoxDto)
  container: BoxDto;

  @IsDefined()
  @ValidateNested({ always: true })
  @Type(() => BoxDto)
  graphics: BoxDto;
}

export class UpdateShapeDto {
  @IsString()
  id: string;

  @IsString()
  fill: string;

  @IsNumber()
  fillAlpha: number;
}
