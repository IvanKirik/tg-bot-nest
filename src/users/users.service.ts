import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { USER_IS_NOT_FOUND } from "./users.constants";
import { Repository } from "sequelize-typescript";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly usersRepository: Repository<User>) {
  }

  async findAll() {
    return await this.usersRepository.findAll();
  }

  async createUser(dto: CreateUserDto) {
    const user = await this.usersRepository.create(dto);
    return user;
  }

  async findOne(userName: string) {
    const user = await this.usersRepository.findOne({ where: { userName } })
    if (!user) {
      throw new BadRequestException(USER_IS_NOT_FOUND)
    }
    return user;
  }

  async remove(userName: string) {
    const user = await this.findOne(userName);
    await user.destroy();
  }
}
