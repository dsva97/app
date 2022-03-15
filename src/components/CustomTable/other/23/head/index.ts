export interface ICellHeadDefinition extends IDataByColumn {
  events: {};
  width: number | string;
  render: (row: IRowHeadConfig, index: number) => JSX.Element;
}

export interface IRowHeadDefinition {
  events: {};
  height: number | string;
  render: (row: IRowHeadConfig, index: number) => JSX.Element;
}
