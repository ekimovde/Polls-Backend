import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';

const DEFAULT_BEARER_VALUE = 'Bearer';

@Injectable()
export class AuthJwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { accesstoken } = request.headers;

      const bearer = accesstoken?.split(' ')[0];
      const token = accesstoken?.split(' ')[1];

      const isBearer = bearer === DEFAULT_BEARER_VALUE;
      const isToken = Boolean(accesstoken);

      if (!isBearer || !isToken) {
        throw new UnauthorizedException();
      }

      const accessTokenData = this.authService.validateAccessToken(token);

      if (!accessTokenData) {
        throw new UnauthorizedException();
      }

      request.user = accessTokenData;

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
