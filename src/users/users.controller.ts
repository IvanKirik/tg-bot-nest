import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly userService: UsersService
  ) {
  }

  @Get()
  async check() {
    try {
      await this.sequelize.authenticate();
      return { status: 'success', message: 'Connected to PostgreSQL database' };
    } catch (error) {
      return { status: 'error', message: 'Failed to connect to PostgreSQL database' };
    }
  }

  @Get('all')
  async getAll() {
    return this.userService.findAll();
  }

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Get('one')
  getUser(@Query('user') user: string) {
    return this.userService.findOne(user);
  }

  @Delete()
  deleteUser(@Query('user') user: string) {
    return this.userService.remove(user);
  }

}
