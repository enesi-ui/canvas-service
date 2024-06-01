import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OriginDto {
  x: number;
  y: number;
}

export class CreateDataResourceDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => OriginDto)
  container: OriginDto;
}

export class UpdateDataResourceDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => OriginDto)
  container: OriginDto;
}
