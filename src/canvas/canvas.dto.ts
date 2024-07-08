import { IsDefined, IsString } from 'class-validator';

export class CanvasDto {
  @IsString()
  id: string;

  @IsDefined()
  @IsString()
  name: string;
}
