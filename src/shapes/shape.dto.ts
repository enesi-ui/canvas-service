import {IsDefined, IsEnum, IsOptional, IsString, ValidateNested} from 'class-validator';
import { ShapeType } from './shape.schema';
import { Type } from 'class-transformer';

export class StrokePropertyDto {
  color: string;
  alpha: number;
  width: number;
}

export class FillPropertyDto {
  color: string;
  alpha: number;
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

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => FillPropertyDto)
  fills: FillPropertyDto[];

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

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FillPropertyDto)
  fills: FillPropertyDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => StrokePropertyDto)
  strokes: StrokePropertyDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => BoxDto)
  container: BoxDto;

  @IsOptional()
  @ValidateNested({ always: true })
  @Type(() => BoxDto)
  graphics: BoxDto;
}
