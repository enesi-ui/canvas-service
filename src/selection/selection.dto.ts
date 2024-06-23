import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateSelectionDto {
  @IsString({ each: true })
  selectShapes: string[];

  @IsString({ each: true })
  deselectShapes: string[];

  @IsBoolean()
  @IsOptional()
  deselectAll: boolean;

  @IsString()
  canvasId: string;
}
