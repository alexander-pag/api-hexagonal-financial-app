import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategory {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsArray()
  @IsOptional()
  transaction_ids?: string[];
}

export class EditCategory {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  user_id?: string;

  @IsArray()
  @IsOptional()
  transactions?: string[];
}
