import { TableEntity } from '../../table.entity';

export interface TablesResponseInterface {
  tables: TableEntity[];
  tablesCount: number;
}
