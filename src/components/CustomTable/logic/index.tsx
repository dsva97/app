import { useMemo, useState } from "react";
import {
  ICellDefinition,
  ICellParams,
  IColumnDefinition,
  IColumnDefinitionHook,
  IColumnsDefinition,
  IColumnsDefinitionHook,
  IDefinition,
  IRowDefinition,
  IRowsData,
  IRowsDefinition,
  IValues,
} from "./type";

export interface IUseDataGridProps {
  columnsDefinition: IColumnsDefinitionHook;
  rowsData: IRowsData;
}
export interface IUseDataGridResult {
  columnsDefinition: IColumnsDefinition;
  rowsData: IRowsData;
  rowsDefinition: IRowsDefinition;
}

const completeColumnDefinition = (
  columnDefinition: IColumnDefinitionHook
): IColumnDefinition => {
  const key = columnDefinition.key;
  return {
    key: key,
    values: {
      value: columnDefinition.values?.value || key,
      title: columnDefinition.values?.title || key,
    },
    setValues:
      columnDefinition.setValues ||
      ((params: ICellParams) => {
        return params.cellDefinition.values as IValues;
      }),
    render:
      columnDefinition.render ||
      ((params: ICellParams) => {
        // console.log(params);
        return <div>{params.data}</div>;
      }),
    events: columnDefinition.events || {},
    columnEvents: columnDefinition.columnEvents || {},
    filterable: columnDefinition.filterable || false,
    sortable: columnDefinition.sortable || false,
    show: columnDefinition.show || true,
  };
};

export const useDataGrid = (props: IUseDataGridProps): IUseDataGridResult => {
  const [rowsData, _setRowsData] = useState(props.rowsData);
  const [columnsDefinition] = useState(
    props.columnsDefinition.map(completeColumnDefinition)
  );
  const [rowsDefinition, _setRowsDefinition] = useState<IRowsDefinition>(
    rowsData.map((rowData) => {
      const rowDefinition: IRowDefinition = {};
      for (const key in rowData) {
        const columnDefinition = columnsDefinition.find(
          (columnDefinition) => columnDefinition.key === key
        );
        const cellDefinition: ICellDefinition = {
          setValues: (params: ICellParams) => {
            return {
              value: params.data,
              title: key,
            };
          },
          render: (params: ICellParams) => {
            return <div>{cellDefinition.values.value}</div>;
          },
          ...columnDefinition,
          key: key,
          values: {
            value: rowData[key],
            title: key,
          },
          events: {},
          columnEvents: {},
          filterable: false,
          sortable: false,
          show: !!columnDefinition,
        };

        rowDefinition[key] = cellDefinition;
      }

      return rowDefinition;
    })
  );

  return {
    columnsDefinition,
    rowsData,
    rowsDefinition,
  };
};

export const _useDataGrid = (props: IUseDataGridProps) => {
  const { columnsDefinition, rowsData } = props;
  const [columnsDefinitionState, setColumnsDefinitionState] =
    useState(columnsDefinition);
  const [rowsDataState, setRowsDataState] = useState(rowsData);
  const [columnsDefinitionStateRef, setColumnsDefinitionStateRef] =
    useState(columnsDefinition);
  const [rowsDataStateRef, setRowsDataStateRef] = useState(rowsData);

  const setColumnsDefinition = (columnsDefinition: IDefinition[]) => {
    setColumnsDefinitionState(columnsDefinition);
    setColumnsDefinitionStateRef(columnsDefinition);
  };

  const setRowsData = (rowsData: any[]) => {
    setRowsDataState(rowsData);
    setRowsDataStateRef(rowsData);
  };

  return {
    columnsDefinition: columnsDefinitionState,
    rowsData: rowsDataState,
    setColumnsDefinition,
    setRowsData,
  };
};
