import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { UnauthorizedException } from '@nestjs/common';

export const errorHandler = (
  customMessage: string,
  logger: Logger,
  error: any,
): never => {
  logger.error(`${customMessage} - ${error.message}`);

  throw exceptionHandler(logger, error);
};

export const exceptionHandler = (logger: Logger, error: any) => {
  if (error instanceof NotFoundException) {
    return new NotFoundException(error.message);
  }
  if (error instanceof UnauthorizedException) {
    return new UnauthorizedException(error.message);
  }
  if (error instanceof ForbiddenException) {
    return new ForbiddenException(error.message);
  }
  if (error instanceof BadRequestException) {
    return new BadRequestException(error.message);
  }
  if (error instanceof ConflictException) {
    return new ConflictException(error.message);
  }
  if (error instanceof GoneException) {
    return new GoneException(error.message);
  }
  logger.error(error.message);
  return new InternalServerErrorException(error.message);
};
