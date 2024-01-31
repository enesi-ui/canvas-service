import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class CreateComponentInstanceDto {
  @IsString()
  name: string;

  @IsString()
  shapeId: string;

  @IsString()
  mainComponentId: string;
}

export class UpdateComponentInstanceDto extends PartialType(
  CreateComponentInstanceDto,
) {}
