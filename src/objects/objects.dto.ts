import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateZIndexObjectDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  aboveObjectId?: string;

  @IsOptional()
  @IsBoolean()
  onTop?: boolean;

  @IsOptional()
  @IsBoolean()
  onBottom?: string;
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
