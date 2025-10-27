import { Module } from "@nestjs/common";
import { ResponseInterceptor } from "../util/interceptor/response.interceptor";

@Module({
  imports: [],
  providers: [ResponseInterceptor],
  exports: [ResponseInterceptor],
})
export class UtilModule {}
