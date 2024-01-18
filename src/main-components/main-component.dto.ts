import { IsString } from 'class-validator';
export class CreateMainComponentDto {
  @IsString()
  name: string;

  @IsString()
  shapeId: string;
}

export class UpdateMainComponentDto {
  @IsString()
  name: string;
}
