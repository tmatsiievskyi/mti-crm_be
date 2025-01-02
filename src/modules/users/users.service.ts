import { Injectable } from '@nestjs/common';
import { TUserIncludes, UsersDao } from './users.dao';
import { ServiceCore } from '@common/core';
import { CreateUserDto } from './dto';
import { TUser } from '@common/types';

@Injectable()
export class UsersService extends ServiceCore {
  constructor(private readonly usersDao: UsersDao) {
    super();
  }

  async findByEmail(email: string, include?: TUserIncludes) {
    return await this.usersDao.findUnique({ where: { email }, include });
  }

  async findById(id: number, include?: TUserIncludes): Promise<TUser | null> {
    return await this.usersDao.findUnique({ where: { id }, include });
  }

  async createUser(user: CreateUserDto) {
    return this.usersDao.create({
      data: {
        email: user.email,
        password: user.password,
        method: user.method,
        profile: {
          create: {
            firstName: user.firstName,
            lastName: user.lastName,
          },
        },
      },
    });
  }
}
