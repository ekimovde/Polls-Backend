import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationExceptions extends HttpException {
  messages: string;

  constructor(response) {
    super(response, HttpStatus.BAD_REQUEST);

    this.message = response;
  }
}
