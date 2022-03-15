import { useCallback, useEffect, useState } from "react";
import {
  IRowData,
  ICellDefinition,
  ICellDefinitionOnlyData,
  IColumnsDefinition,
  IColumnsDefinitionHook,
  IRowDefinition,
  IRowsData,
  IRowsDefinition,
  ISetValues,
  ICellParams,
  IValues,
  IDefinition,
  IColumnDefinition,
} from "./types";

export interface IUseDataGridProps {
  columnsDefinition: IColumnsDefinitionHook;
  rowsData: IRowsData;
}
export interface IUseDataGridResult {
  columnsDefinition: IColumnsDefinition;
  rowsData: IRowsData;
  rowsDefinition: IRowsDefinition;
}

const sanitizeColumnsDefinitionHook = (
  columnsDefinition: IColumnsDefinitionHook
): IColumnsDefinition => {
  return columnsDefinition.map((columnDefinition) => {
    return {
      ...columnDefinition,
      key: columnDefinition.key,
      values: {
        ...columnDefinition.values,
        value: columnDefinition.values?.value || columnDefinition.key,
        title: columnDefinition.values?.title || columnDefinition.key,
      },
      setValues: columnDefinition.setValues || defaultSetter,
      render: columnDefinition.render || defaultRender,
      events: columnDefinition.events || {},
      columnEvents: columnDefinition.columnEvents || {},
      filterable: columnDefinition.filterable || false,
      sortable: columnDefinition.sortable || false,
      show: columnDefinition.show || true,
    };
  });
};

// const defaultSetter: ISetValues = (params: ICellParams) => {
//   return params.cellDefinition.values;
// };
const defaultSetter: ISetValues = () => {};

const defaultRender = (params: ICellParams): React.ReactNode => {
  return params.cellDefinition.values.value;
};

export const useDataTable = (props: IUseDataGridProps) => {
  const [rowsData, setRowsData] = useState(props.rowsData);
  const [columnsDefinition] = useState(
    sanitizeColumnsDefinitionHook(props.columnsDefinition)
  );

  // init rowsDefinition
  const getRowsDefByRowsData = (rowsData: IRowsData) => {
    const newRowsDefinitions = rowsData.map((rowData) => {
      const idRow = rowData.id;

      const rowDefinition: IRowDefinition = {};

      Object.keys(rowData).map((key) => {
        const currentColumnDefinition = columnsDefinition.find(
          (columnDefinition) => columnDefinition.key === key
        ) as IColumnDefinition;

        const cellDefinitionOnlyData: ICellDefinitionOnlyData = {
          key,
          values: {
            title: currentColumnDefinition?.values?.title || key,
            value: rowData[key],
          },
          filterable: !!currentColumnDefinition?.filterable,
          sortable: !!currentColumnDefinition?.sortable,
          show: !!currentColumnDefinition?.show,
          columnEvents: currentColumnDefinition?.columnEvents || {},
        };

        const setValues = (newValues: IValues) => {
          const rowDef = getRowDefById(rowsDefinition)(idRow);
          const getCellParams = createGetCellParams(
            currentColumnDefinition,
            key,
            rowDef
          );
          const createGetValuesSetter = prepareGetValuesSetter(rowsDefinition);
          const getValuesSetter = createGetValuesSetter(getCellParams);
          const setValues = getValuesSetter(cellDefinitionOnlyData);
          setValues(newValues);
        };

        const cellDefinition: ICellDefinition = {
          ...cellDefinitionOnlyData,
          setValues(newValues: IValues) {

          },
          render: currentColumnDefinition?.render || defaultRender,
          events: currentColumnDefinition?.events || {},
        };

        rowDefinition[key] = cellDefinition;
      });

      return rowDefinition;
    });
    return newRowsDefinitions
  };

  const [rowsDefinition, setRowsDefinition] = useState<IRowsDefinition>(
    // getRowsDefByRowsData(rowsData)
    ((rowsData: IRowsData) => {
      const newRowsDefinitions = rowsData.map((rowData) => {
        const idRow = rowData.id;
  
        const rowDefinition: IRowDefinition = {};
  
        Object.keys(rowData).map((key) => {
          const currentColumnDefinition = columnsDefinition.find(
            (columnDefinition) => columnDefinition.key === key
          ) as IColumnDefinition;
  
          const cellDefinitionOnlyData: ICellDefinitionOnlyData = {
            key,
            values: {
              title: currentColumnDefinition?.values?.title || key,
              value: rowData[key],
            },
            filterable: !!currentColumnDefinition?.filterable,
            sortable: !!currentColumnDefinition?.sortable,
            show: !!currentColumnDefinition?.show,
            columnEvents: currentColumnDefinition?.columnEvents || {},
          };
  
          const setValues = (newValues: IValues) => {
            const rowDef = getRowDefById(rowsDefinition)(idRow);
            const getCellParams = createGetCellParams(
              currentColumnDefinition,
              key,
              rowDef
            );
            const createGetValuesSetter = prepareGetValuesSetter(rowsDefinition);
            const getValuesSetter = createGetValuesSetter(getCellParams);
            const setValues = getValuesSetter(cellDefinitionOnlyData);
            setValues(newValues);
          };
  
          const cellDefinition: ICellDefinition = {
            ...cellDefinitionOnlyData,
            setValues(newValues: IValues) {
              const newNewRowsDef = newRowsDefinitions.map((rowDefinition) => {
                if (rowDefinition.id.values.value === idRow) {
                  const newRowDefinition = {
                    ...rowDefinition,
                    [key]: {
                      ...rowDefinition[key],
                      values: {
                        ...rowDefinition[key].values,
                        value: newValues.value,
                      },
                    },
                  };
                  return newRowDefinition;
                }
                return rowDefinition;
              });
              setRowsDefinition(newNewRowsDef)
            },
            render: currentColumnDefinition?.render || defaultRender,
            events: currentColumnDefinition?.events || {},
          };
  
          rowDefinition[key] = cellDefinition;
        });
  
        return rowDefinition;
      });
      return newRowsDefinitions
    })(rowsData)
  );

  const getRowDefById = useCallback(
    (_rowsDefinition: IRowsDefinition) => (id: any) => {
      return (_rowsDefinition || rowsDefinition).find((rowDefinition) => {
        return rowDefinition.id.values.value === id;
      });
    },
    [rowsDefinition]
  );

  const getRowDataByRowDef = useCallback(
    (rowDefinition: IRowDefinition): IRowData => {
      const rowData: IRowData = {};

      Object.keys(rowDefinition).forEach((key) => {
        rowData[key] = rowDefinition[key].values.value;
      });

      return rowData;
    },
    [rowsDefinition]
  );

  const getRowsDataByRowsRef = useCallback(
    (_rowsDefinition?: IRowsDefinition): IRowsData => {
      const rowsData: IRowsData = [];
      (_rowsDefinition || rowsDefinition).forEach((rowDefinition) => {
        const rowData = getRowDataByRowDef(rowDefinition);
        rowsData.push(rowData);
      });

      return rowsData;
    },
    [rowsDefinition]
  );

  const prepareGetValuesSetter = useCallback(
    (_rowsDefinition?: IRowsDefinition) =>
      (getCellParams: () => ICellParams | null) =>
      (cellDefinition: ICellDefinitionOnlyData) =>
      async (newValues: IValues) => {
        const params = getCellParams();
        if (params) {
          const newRowsDefinitions = (_rowsDefinition || rowsDefinition).map(
            (rowDefinition) => {
              // is the rowDefinition the one we are editing
              if (rowDefinition.id.values.value === params.rowData.id) {
                // is the cellDefinition the one we are editing
                const newCellDefinition: ICellDefinition = {
                  ...rowDefinition[cellDefinition.key],
                };
                newCellDefinition.values = newValues;

                const newRowDefinition = {
                  ...rowDefinition,
                  [cellDefinition.key]: newCellDefinition,
                };
                return newRowDefinition;
              }

              return rowDefinition;
            }
          );

          setRowsDefinition(newRowsDefinitions);
        } else {
          console.error("no params");
        }
      },
    [rowsDefinition]
  );

  const createGetCellParams = useCallback(
    (
        currentColumnDefinition: IColumnDefinition,
        key: any,
        rowDef?: IRowDefinition
      ) =>
      () => {
        if (rowDef) {
          const cellDef = rowDef[key];
          if (cellDef) {
            const data = cellDef.values.value;
            const rowData = getRowDataByRowDef(rowDef);
            const rowsData = getRowsDataByRowsRef();

            const columnDefinition = currentColumnDefinition;

            const cellDefinition = cellDef;
            const rowDefinition = rowDef;

            return {
              data,
              rowData,
              rowsData,
              columnDefinition,
              columnsDefinition,
              cellDefinition,
              rowDefinition,
              rowsDefinition,
            };
          }
        }
        return null;
      },
    [rowsDefinition]
  );

  useEffect(() => {
    const newRowsDefinitions = props.rowsData.map((rowData) => {
      const idRow = rowData.id;

      const rowDefinition: IRowDefinition = {};

      Object.keys(rowData).map((key) => {
        const currentColumnDefinition = columnsDefinition.find(
          (columnDefinition) => columnDefinition.key === key
        ) as IColumnDefinition;

        const cellDefinitionOnlyData: ICellDefinitionOnlyData = {
          key,
          values: {
            title: currentColumnDefinition?.values?.title || key,
            value: rowData[key],
          },
          filterable: !!currentColumnDefinition?.filterable,
          sortable: !!currentColumnDefinition?.sortable,
          show: !!currentColumnDefinition?.show,
          columnEvents: currentColumnDefinition?.columnEvents || {},
        };

        const setValues = (newValues: IValues) => {
          const rowDef = getRowDefById(newRowsDefinitions)(idRow);
          const getCellParams = createGetCellParams(
            currentColumnDefinition,
            key,
            rowDef
          );
          const createGetValuesSetter =
            prepareGetValuesSetter(newRowsDefinitions);
          const getValuesSetter = createGetValuesSetter(getCellParams);
          const setValues = getValuesSetter(cellDefinitionOnlyData);
          setValues(newValues);
        };

        const cellDefinition: ICellDefinition = {
          ...cellDefinitionOnlyData,
          setValues,
          render: currentColumnDefinition?.render || defaultRender,
          events: currentColumnDefinition?.events || {},
        };

        rowDefinition[key] = cellDefinition;
      });

      return rowDefinition;
    });
  }, []);

  // Update rowsData when rowsDefinition changes
  useEffect(() => {
    const newRowsData = getRowsDataByRowsRef();
    setRowsData(newRowsData);
  }, [rowsDefinition]);

  return {
    columnsDefinition,
    rowsDefinition,
    rowsData,
  };
};
