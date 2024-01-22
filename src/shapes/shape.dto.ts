import { IsEnum, IsString } from 'class-validator';
import { ShapeType } from './shape.schema';

//todo add further fields
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
