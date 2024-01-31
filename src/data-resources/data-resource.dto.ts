import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OriginDto {
  x: number;
  y: number;
}

export class CreateDataRessourceDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => OriginDto)
  container: OriginDto;
}

export class UpdateDataRessourceDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => OriginDto)
  container: OriginDto;
}
