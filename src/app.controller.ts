import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary : 'Welcome to the API',
    responses : {
      200 : {
        description : 'API is up and running'
      },
      500 : {
        description : "Something is wrong contact api maintainer"
      }
    }
  })
  @Get()
  getHello(): {} {
    return this.appService.getHello();
  }
}
