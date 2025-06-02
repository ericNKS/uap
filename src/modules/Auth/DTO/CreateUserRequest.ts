import { IsString, IsEmail, MinLength, ValidateNested, IsOptional, IsArray, Max, Min, Length } from 'class-validator';
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
  NomeUser: string = '';

  @IsEmail()
  EmailUser: string = '';

  @ValidateNested()
  @Type(() => PasswordDTO)
  SenhaUser: PasswordDTO = new PasswordDTO();

  @IsString()
  @Length(11, 11)
  @IsOptional()
  TelUser?: string = '';

  @IsString()
  @Length(11, 16)
  CpfOrCnpjUser: string = '';

  @IsString()
  @IsOptional()
  CrpUser?: string = '';

  @IsString()
  @IsOptional()
  ImgUrlUser?: string = '';

  @IsString()
  GenUser: string = '';

  @IsString()
  PronomeUser: string = '';

  @IsString()
  @IsOptional()
  RulesUser?: string = 'RULE_USER';

}