import { IsString } from 'class-validator';

export class CreateVariantDto {}

export class UpdateVariantDto {
  @IsString()
  id: string;
}
