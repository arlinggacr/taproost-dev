import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class EAuthSESException extends HttpException {
  constructor(error?: any) {
    super(error, 535);
  }
}

export class EMessageSESException extends HttpException {
  constructor(error?: any) {
    super(error, 554);
  }
}

export class RequestTimeTooSkewed extends HttpException {
  constructor(error?: any) {
    super(error, 403);
  }
}

export const ParseException = (error: any): void => {
  const logger = new Logger();
  const errorName = error?.code || error?.name;

  switch (errorName) {
    case 'ForbiddenException':
      logger.error(errorName);
      throw new ForbiddenException(error?.response);
    case 'NotFoundException':
      logger.error(errorName);
      throw new NotFoundException(error?.response);
    case 'UnauthorizedException':
      logger.error(errorName);
      throw new UnauthorizedException(error?.response);
    case 'BadRequestException':
      logger.error(errorName);
      throw new BadRequestException(error?.response);
    case 'EAUTH':
      logger.error('EAuthSESException');
      throw new EAuthSESException(error?.response);
    case 'EMESSAGE':
      logger.error('EMessageSESException');
      throw new EMessageSESException(error?.response);
    case 'QueryFailedError':
      logger.error('QueryFailedError');
      throw new ConflictException(error?.detail);
    case 'RequestTimeTooSkewed':
      logger.error('RequestTimeTooSkewed');
      throw new RequestTimeTooSkewed(error?.Code);
    default:
      logger.error('InternalServerErrorException');
      throw new InternalServerErrorException(error);
  }
};
