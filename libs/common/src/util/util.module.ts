import { ResponseInterceptor } from '@app/common/util/interceptor/response.interceptor';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [ResponseInterceptor],
  exports: [ResponseInterceptor],
})
export class UtilModule {}
