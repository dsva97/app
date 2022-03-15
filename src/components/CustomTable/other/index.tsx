import { useMemo, useState } from "react";
import { ICellDefinition, IColumnsDefinition } from "./types";

export class DataGrid {
  data: any[];
  columnsDefinitions: IColumnsDefinition;
  setReactState: React.Dispatch<React.SetStateAction<any>>;

  constructor(
    setReactState: React.Dispatch<React.SetStateAction<any>>,
    data: any[],
    columnsDefinitions: IColumnsDefinition
  ) {
    this.data = data;
    this.columnsDefinitions = columnsDefinitions;
    this.setReactState = setReactState;
  }

  getParamsForCell(cellDef: ICellDefinition) {
    return {
      cellDefinition: cellDef,
      setValues: this.setCellValues,
      values: {
        value: "",
      },
    };
  }

  setCellValues(cellDef: ICellDefinition) {}

  setData() {}
}

export const useDataGrid = (
  data: any[],
  columnsDefinitions: IColumnsDefinition,
  rowsDefinitions: IRowsDefinitions
) => {
  const [resultData, setData] = useState<any[]>(data);

  const dataGrid = useMemo(() => {
    const dataGrid = new DataGrid(setData, data, columnsDefinitions, rowsDefinitions)
    return dataGrid  
  }, []);

  return {
    data: resultData,
    setData,
    dataGrid
  }
}
) => {
