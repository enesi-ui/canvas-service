import { IsEnum, IsString } from 'class-validator';
import { ComponentPropertyType } from './component-property.schema';

export class CreateComponentPropertyDto {
  @IsString()
  mainComponentId: string;

  @IsEnum(ComponentPropertyType)
  type: ComponentPropertyType;

  @IsString()
  name: string;

  @IsString()
  value: string;
}

export class UpdateComponentPropertyDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  value: string;
}
