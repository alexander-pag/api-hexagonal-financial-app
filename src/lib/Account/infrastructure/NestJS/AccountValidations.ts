import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAccountDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  balance: number;
}

export class EditAccountDTO {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  user_id?: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  balance?: number;
}
