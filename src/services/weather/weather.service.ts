import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    private readonly config: ConfigService,
  ) {}

  async getWeather(zip: string | string[] | undefined): Promise<object> {
    const apiKey = this.config.get('openWeatherApiKey');

    const endpoint = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}`;

    const fetch = require('node-fetch');

    const result = await fetch(endpoint).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        return response.json();
      }
    });

    return {
      zip: zip,
      description: result.weather[0].description,
    };
  }
}
