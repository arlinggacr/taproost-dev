import {
  IPageableRequest,
  IPageableResponse,
} from '@app/common/swagger/interface/pageable.interface';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PageableRequestDto implements IPageableRequest {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page = 1;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  size = 10;
}

export class PageableResponseDto implements IPageableResponse {
  @Expose()
  total_data: number;

  @Expose()
  total_page: number;

  @Expose()
  data_count: number;
}
