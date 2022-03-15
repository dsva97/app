import { IColumnDefinition, IColumnsDefinition } from "./column";
import { IData, IRowData } from "./data";
import { IRowDefinition, IRowsDefinition, ISetRowValues } from "./row";

export interface IValues {
  value: null | any;
  title: string;
  [keyValue: string | number]: any;
}

export type ISetValues = (values: IValues) => Promise<void> | void;

export interface ICellDefinition extends IColumnDefinition {
  values: IValues;
  setValues: ISetValues;
}

export interface ICellParams {
  values: IValues;

  setValues: ISetValues;
  setRowValues: ISetRowValues;

  // getters and data
  data: IData;
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
