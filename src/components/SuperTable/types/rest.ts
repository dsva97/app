import { IRowData, Key } from "./data";
import { IColumnDefinition } from "./definitions";

export type IValue = any;

export interface IValues {
  value: IValue;
  [key: Key]: any;
}

export type IArrayValues = IValues[];

export interface IObjectValues {
  [key: Key]: IValues;
}

export type ISetValue = (value: IValue) => Promise<void> | void;
export type ISetValues = (values: IValues) => Promise<void> | void;

export interface ICellState
  extends Omit<IColumnDefinition, "value" | "values" | "setValues"> {
  value: IValue;
  values: IValues;
  setValue: ISetValue;
  setValues: ISetValues;

  columnState: IColumnState;
  rowState: IRowState;
}
export type ICellStateNoParentData = Omit<
  ICellState,
  "columnState" | "rowState"
>;

export interface IRowState {
  data: IRowData;

  values: IArrayValues;

  setData: (data: IRowData) => Promise<void> | void;
  setValues: (values: IArrayValues) => Promise<void> | void;

  state: ICellState[];

  show?: boolean;
}

// export interface IRowsState {
export interface IFullState {
  data: IRowData[];

  values: IArrayValues[];

  setData: (data: IRowData[]) => Promise<void> | void;
  setValues: (values: IObjectValues) => Promise<void> | void;

  state: IRowState[];
}

export interface IColumnState {
  data: IValue[];

  values: IArrayValues;

  setData: (data: IValue[]) => Promise<void> | void;
  setValues: (values: IArrayValues) => Promise<void> | void;

  state: ICellState[];
}

///
export interface ICellParams {
  value: IValue;
  values: IValues;
  setValue: ISetValue;
  setValues: ISetValues;

  rowState: IRowState;
  columnState: ICellState;
  fullState: IFullState;
}

export interface IEmptyCellParams {
  value: IValue;
  values: IValues;
  setValue: ISetValue;
  setValues: ISetValues;

  rowState: ICellState;
  columnState: IRowState;
  fullState: IFullState;
}
