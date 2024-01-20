import { IsString } from 'class-validator';
export class CreateMainComponentDto {
  @IsString()
  name: string;

  @IsString()
  shapeId: string;
}

export class UpdateMainComponentDto {
  @IsString()
  id: string;

  @IsString()
  name: string;
}
