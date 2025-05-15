import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  emailUser: string = '';

  @IsString()
  @MinLength(8)
  senhaUser: string = '';
}