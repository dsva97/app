export type IData = any;
export interface IValues {
  value: null | any;
  title: string;
  [key: string]: any;
}
export type IRowData = { [key: string]: IData };
export type IRowsData = IRowData[];

export interface ICellParams {
  // getters and data
  data: IData;
  rowData: IRowData;
  rowsData: IRowData[]; // global

  // getters and definitions
  columnDefinition?: IColumnDefinition; // pseudo-global
  columnsDefinition: IColumnsDefinition; // pseudo-global

  // getters and setters and definitions
  cellDefinition: ICellDefinition;
  rowDefinition: IRowDefinition;
  rowsDefinition: IRowsDefinition; // global
}

export type ICellDefinitionOnlyData = Omit<ICellDefinition, "setValues" | "render" | "events"> 

export type IColumnParams = Omit<
  ICellParams,
  "data" | "rowData" | "cellDefinition" | "rowDefinition"
>;

export interface ITableColumnEvents {
  onFilter?: (params: IColumnParams) => void;
  onSort?: (params: IColumnParams) => void;
}
export interface ITableCellEvents {
  onFilter?: (params: ICellParams) => void;
  onSort?: (params: ICellParams) => void;
}
export type ICellEvents = ITableCellEvents & {
  [keyEvent: string]: (params: ICellParams) => React.EventHandler<any>;
};

// export type ISetValues = (params: ICellParams) => Promise<IValues> | IValues;
export type ISetValues = (newValues: IValues) => Promise<void> | void;

// export type ICellSetValues = (params: ICellParams) => Promise<void> | void;
export type ICellSetValues = ISetValues;

export interface IDefinition {
  key: string;
  values: IValues;
  setValues: ISetValues;
  render: (params: ICellParams) => React.ReactNode;
  events: ICellEvents;
  columnEvents: ITableColumnEvents;

  filterable: boolean;
  sortable: boolean;
  show: boolean;
}

export type ICellDefinition = Omit<IDefinition, "setValues"> & { setValues: ICellSetValues };
export type IRowDefinition = { [key: string]: ICellDefinition };
export type IRowsDefinition = IRowDefinition[];

export type IColumnDefinition = IDefinition;
export type IColumnsDefinition = IColumnDefinition[];

export type IColumnDefinitionHook = Pick<IColumnDefinition, "key"> &
  Partial<IColumnDefinition>;
export type IColumnsDefinitionHook = IColumnDefinitionHook[];
