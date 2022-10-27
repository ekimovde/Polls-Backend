import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

const DEFAULT_BEARER_VALUE = 'Bearer';

@Injectable()
export class AuthJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const { authorization } = req.headers;

      const bearer = authorization.split(' ')[0];
      const token = authorization.split(' ')[1];

      const isBearer = bearer === DEFAULT_BEARER_VALUE;
      const isToken = Boolean(token);

      if (!isBearer || !isToken) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован!',
        });
      }

      req.user = this.jwtService.verify(token);

      return true;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован!',
      });
    }
  }
}
