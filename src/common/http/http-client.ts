import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class HttpClient {
  constructor(private readonly httpService: HttpService) {}

  private readonly logger = new Logger(HttpClient.name);

  /**
   * Performs a GET request to the specified URL.
   *
   * @param {string} url - The URL to send the GET request to.
   * @returns {Promise<any>} The response data from the GET request.
   * @throws {BadRequestException} If the request fails or Axios returns an error.
   */
  async get(url: string): Promise<any> {
    try {
      return await this.httpService.axiosRef.get(url);
    } catch (error) {
      return this.handleAxiosError(error, url);
    }
  }

  /**
   * Handles errors from Axios GET requests.
   *
   * Logs the error and throws a BadRequestException with details if it's an Axios error,
   * otherwise throws a generic BadRequestException.
   *
   * @param {any} error - The error object caught from the Axios request.
   * @param {string} url - The URL that was being accessed when the error occurred.
   * @throws {BadRequestException} Always throws an exception describing the failure.
   * @returns {never} This function never returns; it always throws an exception.
   */
  private handleAxiosError(error: any, url: string): never {
    this.logger.error(`Axios error while loading: ${url}`, error.message);

    // Checks if it's an Axios error
    if (error.isAxiosError) {
      const status = error.response?.status;
      const statusText = error.response?.statusText;

      throw new BadRequestException({
        message: 'Failed to load external page',
        url,
        axiosStatus: status,
        axiosStatusText: statusText,
      });
    }

    // fallback
    throw new BadRequestException(
      'Unexpected error while loading external URL.',
    );
  }
}
