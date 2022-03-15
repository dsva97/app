interface IValue {
  value: any;
  [key: Key]: any;
}
type Key = string | number | symbol;
type IdRowData = Key;

export interface IDataByColumn {
  data: any[];
  values: IValue[];
  valuesById: {
    [id: IdRowData]: IValue;
  };
}

export interface IDataByRow {
  data: IRowData;
  values: IValue[];
}
