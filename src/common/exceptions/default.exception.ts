import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { getResponseForm } from 'src/shared/utils/get-response-form';

@Catch(HttpException)
export class DefaultExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json(
      getResponseForm(null, {
        status: 'Error',
        description: error.message,
      }),
    );
  }
}
