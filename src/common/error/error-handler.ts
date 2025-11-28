import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { UnauthorizedException } from '@nestjs/common';

/**
 * Handles an error by logging a custom message and rethrowing the appropriate HTTP exception.
 *
 * @param {string} customMessage - A custom message describing the context of the error.
 * @param {Logger} logger - A NestJS Logger instance to log the error.
 * @param {any} error - The original error object.
 * @throws {HttpException} Throws the mapped HTTP exception based on the type of the error.
 * @returns {never} This function never returns; it always throws an exception.
 */
export const errorHandler = (
  customMessage: string,
  logger: Logger,
  error: any,
): never => {
  logger.error(`${customMessage} - ${error.message}`);

  throw exceptionHandler(logger, error);
};

/**
 * Maps a given error to the corresponding NestJS HTTP exception.
 *
 * Supported mappings:
 * - NotFoundException
 * - UnauthorizedException
 * - ForbiddenException
 * - BadRequestException
 * - ConflictException
 * - GoneException
 * - All other errors → InternalServerErrorException
 *
 * @param {Logger} logger - A NestJS Logger instance to log the error if it's not a known exception.
 * @param {any} error - The original error object.
 * @returns {HttpException} The appropriate NestJS HTTP exception corresponding to the error type.
 */
export const exceptionHandler = (logger: Logger, error: any): HttpException => {
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
  return new InternalServerErrorException(error.message);
};
