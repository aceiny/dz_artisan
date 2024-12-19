import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SignupUserDto } from './dto/signup-user.dto';
import * as bcrypt from 'bcrypt';
import { SigninUserDto } from './dto/signin-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { access } from 'fs';
@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly authService : AuthService
  ) {}
  async checkUserExists(email: string) {
    if (!email) throw new ConflictException('No Email Provided');
    const query = 'SELECT email FROM users WHERE email = $1';
    const values = [email];
    const user = await this.databaseService.query(query, values);
    if (user.length === 0) return false;
    return true;
  }
  async findUserByEmail(email: string) {
    if (!email) throw new ConflictException('No Email Provided');
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const user = await this.databaseService.query(query, values);
    if (user.length === 0) throw new ConflictException('Invalid Credentials');
    return user[0];
  }
  async findAll() {
    const query = `
    SELECT 
      user_id,
      full_name,
      email,
      phone_number,
      address,
      wilaya,
      role,
      created_at,
      updated_at
    FROM users 
    `;
    const users = await this.databaseService.query(query);
    return users;
  }
  async signup(signupUserDto: SignupUserDto) {
    if (await this.checkUserExists(signupUserDto.email))
      throw new ConflictException('Email Already Taken');
    const query =
      'INSERT INTO users (full_name , email, password, phone_number, address , wilaya) VALUES ($1, $2, $3, $4, $5 , $6) RETURNING *';
    const hash_salt = 12;
    const password_hash = await bcrypt.hash(signupUserDto.password, hash_salt);
    const values = [
      signupUserDto.full_name,
      signupUserDto.email,
      password_hash,
      signupUserDto.phone_number,
      signupUserDto.address,
      signupUserDto.wilaya,
    ];
    const user = await this.databaseService.query(query, values);
    if(!user[0]) throw new ConflictException('User not created');
    return {
      access_token : await this.authService.generateAccessToken({
        id : user[0].user_id,
        role : user[0].role
      }),
      refresh_token : await this.authService.generateRefreshToken({
        id : user[0].user_id,
        role : user[0].role
      })
    }
  }

  async signin(signinUserDto: SigninUserDto) {
    const user = await this.findUserByEmail(signinUserDto.email);
    const password = user.password;
    const is_match = await bcrypt.compare(signinUserDto.password, password);
    if (!is_match) throw new ConflictException('Invalid Credentials');
    return {
      access_token : await this.authService.generateAccessToken({
        id : user.user_id,
        role : user.role
      }),
      refresh_token : await this.authService.generateRefreshToken({
        id : user.user_id,
        role : user.role
      })
    }
  }
  async findOne(userId: string) {
    const query = `
    SELECT 
      user_id,
      full_name,
      email,
      phone_number,
      address,
      wilaya,
      role,
      created_at,
      updated_at
    FROM users 
    WHERE user_id = $1
    `;
    const values = [userId];
    const user = await this.databaseService.query(query, values);
    console.log(user);
    if (user.length === 0) throw new ConflictException('User Not Found');
    return user[0];
  }
}
