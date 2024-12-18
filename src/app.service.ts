import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): {} {
    return {
      message:
        'Welcome to Dz Artisan api ! , if u wish to check the docs please head to /api',
      status: HttpStatus.OK,
    };
  }
}
