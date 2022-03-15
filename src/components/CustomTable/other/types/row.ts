import { IRowData } from "./data";

export interface IRowDefinition {
  keyId: string;
  dataDefinition: {
    [nameColumn: string]: any;
  };
  data: {
    [nameColumn: string]: any;
  };
}

export type ISetRowValues = (values: IRowData) => Promise<void> | void;

export type IRowsDefinition = IRowDefinition[];

export type IRowValue = IRowData;

export interface IRowParams {
  values: IRowValue;
  setValues: ISetRowValues;

  // getters and data
  rowData: IRowData;
  rowsData: IRowData[]; // global

  // getters and definitions
  columnDefinition: IColumnDefinition; // pseudo-global
  columnsDefinition: IColumnsDefinition; // pseudo-global

  // getters and setters and definitions
  cellDefinition: ICellDefinition;
  rowDefinition: IRowDefinition;
  rowsDefinition: IRowsDefinition; // global
}
