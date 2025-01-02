import { Module } from '@nestjs/common';
import { UsersDao } from './users.dao';
import { UsersService } from './users.service';
import { PrismaModule } from '@libs/prisma';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, UsersDao],
  exports: [UsersService],
})
export class UsersModule {}
