import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IPageableRequest,
  IPageableResponse,
} from "../../swagger/interface/pageable.interface";

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
