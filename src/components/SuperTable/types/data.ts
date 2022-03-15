export type Key = string | number | symbol;

export interface IRowData {
  [key: Key]: any;
}

export type IRowsData = IRowData[];
