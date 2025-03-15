import { IsString, IsNumber, IsUrl, IsNotEmpty } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
} 