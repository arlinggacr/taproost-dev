import {
  IPageableRequest,
  IPageableResponse,
} from '@app/common/swagger/interface/pageable.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PageableRequestSchema implements IPageableRequest {
  @ApiPropertyOptional({
    type: Number,
    default: 1,
  })
  page: number;

  @ApiPropertyOptional({
    type: Number,
    default: 10,
  })
  size: number;
}

export class PageableResponseSchema implements IPageableResponse {
  @ApiProperty()
  total_data: number;

  @ApiProperty()
  total_page: number;

  @ApiProperty()
  data_count: number;
}
