import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { getResponseForm } from 'src/shared/utils/get-response-form';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status =
      error instanceof UnauthorizedException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json(
      getResponseForm(null, {
        status: 'Error',
        description: 'Пользователь не авторизован!',
      }),
    );
  }
}
