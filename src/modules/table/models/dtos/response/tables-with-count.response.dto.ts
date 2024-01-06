import { TableResponseDto } from './table.response.dto';

export class TablesWithCountResponseDto {
  tables: TableResponseDto[];
  tablesCount: number;
}
