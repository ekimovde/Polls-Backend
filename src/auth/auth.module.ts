import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_ACCESS_SECRET,
        signOptions: {
          expiresIn: process.env.EXPIRES_IN_ACCESS,
        },
      }),
    }),
  ],
  exports: [AuthService, JwtModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
