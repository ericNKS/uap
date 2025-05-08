import { IsString, IsEmail, MinLength, ValidateNested, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class PasswordDTO {
  @IsString()
  @MinLength(8)
  first: string = '';

  @IsString()
  @MinLength(8)
  second: string = '';
}

export class CreateUserRequest {
  @IsString()
  name: string = '';

  @IsEmail()
  email: string = '';

  @ValidateNested()
  @Type(() => PasswordDTO)
  password: PasswordDTO = new PasswordDTO();

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rules?: string[];
}