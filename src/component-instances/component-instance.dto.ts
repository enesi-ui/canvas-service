import { PartialType } from '@nestjs/mapped-types';

export class CreateComponentInstanceDto {
  name: string;
  shapeId: string;
  mainComponentId: string;
}

export class UpdateComponentInstanceDto extends PartialType(
  CreateComponentInstanceDto,
) {}
