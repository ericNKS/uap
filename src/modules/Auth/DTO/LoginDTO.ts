import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  EmailUser: string = '';

  @IsString()
  @MinLength(8)
  SenhaUser: string = '';
}