import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class HttpClient {
  constructor(private readonly httpService: HttpService) {}

  private readonly logger = new Logger(HttpClient.name);

  async get(url: string): Promise<any> {
    try {
      return await this.httpService.axiosRef.get(url);
    } catch (error) {
      return this.handleAxiosError(error, url);
    }
  }

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
