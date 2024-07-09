import { IsDefined, IsString } from 'class-validator';

export class CanvasDto {
  @IsDefined()
  @IsString()
  name: string;
}
