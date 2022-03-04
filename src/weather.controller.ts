import {
  Get,
  Controller,
  Render,
  Req,
  Res,
  Param,
  UseInterceptors,
  Body,
  Post,
  Logger,
} from '@nestjs/common';
import { WeatherService } from './services/weather/weather.service';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('weather')
export default class WeatherController {
  private logger = new Logger(WeatherController.name);

  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @Render('weatherForm')
  getWeather(@Req() request: Request, @Res() response: Response) {
    this.logger.log('displaying weather form');
    return;
  }

  @Post()
  @Render('weather')
  @UseInterceptors(FileInterceptor('file'))
  async showWeatherByZip(@Body() body) {
    this.logger.log(body);
    return await this.weatherService.getWeather(body.zip);
  }
}
