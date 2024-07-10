import {
  IsBoolean, IsDefined,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateZIndexObjectDto {
  @IsString()
  @IsDefined()
  id: string;

  @IsOptional()
  @IsString()
  belowObject?: string;

  @IsOptional()
  @IsBoolean()
  onTop?: boolean;

  @IsOptional()
  @IsBoolean()
  onBottom?: string;

  @IsOptional()
  @IsString()
  canvasId?: string;
}

export class UpdateObjectDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  zIndex?: number;
}
