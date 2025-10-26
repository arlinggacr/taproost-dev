export interface IPageableRequest {
  page: number;
  size: number;
}

export interface IPageableResponse {
  total_data: number;
  total_page: number;
  data_count: number;
}
