import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DataResourcePropertyType } from './data-resource-property.schema';

export class CreateDataResourcePropertyDto {
  @IsNotEmpty()
  @IsString()
  dataResourceId: string;

  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsEnum(DataResourcePropertyType)
  type: DataResourcePropertyType;

  @IsString()
  value?: string;

  @IsString()
  url?: string;
}

export class UpdateDataResourcePropertyDto {
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsEnum(DataResourcePropertyType)
  type: DataResourcePropertyType;

  @IsString()
  value?: string;

  @IsString()
  url?: string;
}
