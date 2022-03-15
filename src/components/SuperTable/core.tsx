import { IOptions } from "./Thead/Th/Filter";
import {
  IColumnsDefinition,
  IRowsDefinition,
  IDefinitions,
  IRowsData,
  IFullState,
  IRowState,
  ICellState,
  IValues,
  ICellStateNoParentData,
  IValue,
  IRowData,
  IColumnState,
  IArrayValues,
  IColumnDefinition,
  IObjectValues,
} from "./types";

export interface ICoreData {
  data: IRowsData;
  columnsDefinition: IColumnsDefinition;
  rowsDefinition: IRowsDefinition;
  fullState: IFullState;
}
export class GridTable {
  data: IRowsData;
  columnsDefinition: IColumnsDefinition;
  rowsDefinition: IRowsDefinition;

  fullState?: IFullState;

  get coreData(): ICoreData {
    return {
      data: this.data,
      columnsDefinition: this.columnsDefinition,
      rowsDefinition: this.rowsDefinition,
      fullState: this.fullState!,
    };
  }

  constructor(
    data: IRowsData,
    definitions: IDefinitions,
    callbackSubscriber: ICallbackSubscriber
  ) {
    this.data = data;
    this.columnsDefinition = definitions.columnsDefinition;
    this.rowsDefinition = definitions.rowsDefinition;
    this.initFirstFullState();
    this.subscribe(callbackSubscriber);
    this.emit(this.coreData);
  }

  private getRowStateFromCellState(
    cellState: Omit<ICellState, "rowState">
  ): IRowState {
    const rowState = this.fullState?.state.find((rowState) => {
      return rowState.data[cellState.key] === cellState.value;
    }) as IRowState;

    return rowState;
  }

  private createCellStateFromStateNPD(
    cellState: ICellStateNoParentData
  ): ICellState {
    const protoCellState: Omit<ICellState, "rowState"> = {
      ...cellState,
      value: cellState.value,
      values: {
        value: cellState.value,
      },
      columnState: this.createColumnStateFromCellStateNPD(cellState),
    };
    const rowState = this.getRowStateFromCellState(protoCellState);

    const _cellState: ICellState = {
      ...protoCellState,
      rowState,
    };

    return _cellState;
  }

  private createCellStateFromCellData(
    columnDefinition: IColumnDefinition,
    rowData: IRowData,
    key: string
  ): ICellState {
    const me = this;
    const cellData = rowData[key];
    const lastAlternative = columnDefinition.getValue
      ? columnDefinition.getValue(rowData)
      : null;
    const value = rowData.hasOwnProperty(key) ? cellData : lastAlternative;

    const cellStateNPD: ICellStateNoParentData = {
      ...columnDefinition,
      value,
      values: {
        value,
      },
      setValue(value: IValue): void | Promise<void> {
        let thisCellState = this as ICellState;
        thisCellState = { ...thisCellState, ...cellStateNPD };
        const newFullState = me.setValueFromCell(thisCellState, value);

        me.fullState = newFullState;
        me.emit(me.coreData);
      },
      setValues(values: IValues): void | Promise<void> {
        const thisCellState = this as ICellState;
        const newFullState = me.setValuesFromCell(thisCellState, values);
      },
    };
    const cellState = this.createCellStateFromStateNPD(cellStateNPD);

    return cellState;
  }

  private createColumnStateFromCellStateNPD(
    cellState: ICellStateNoParentData
  ): IColumnState {
    if (this.fullState) {
      const stateForColumnState: IColumnState["state"] = this.fullState.state
        .map((rowState) => {
          const _cellState = rowState.state.find((_cellState) => {
            return _cellState.key === cellState.key;
          });
          return _cellState;
        })
        .filter((cell) => cell) as IColumnState["state"];

      const columnState: IColumnState = {
        state: stateForColumnState,
        data: stateForColumnState.map((cellState) => cellState.value),
        values: stateForColumnState.map((cellState) => cellState.values),
        setData: function (data: any[]): void | Promise<void> {},
        setValues: function (values: IArrayValues): void | Promise<void> {},
      };
      return columnState;
    } else {
      const columnState: IColumnState = {
        state: [],
        data: [],
        values: [],
        setData: function (data: any[]): void | Promise<void> {},
        setValues: function (values: IArrayValues): void | Promise<void> {},
      };

      return columnState;
    }
  }

  private createRowStateFromData(rowData: IRowData): IRowState {
    const findRowState =
      this.fullState?.state.find((rowState) => {
        const keyId = this.rowsDefinition.idKey;
        return rowState.data[keyId] === rowData[keyId];
      }) || {};

    const rowState: IRowState = {
      ...findRowState,
      data: rowData,

      values: [], // TODO: ¿create values from data?

      setData: (data: IRowData) => {},
      setValues: (values: IArrayValues) => {},

      state: [],
    };

    return rowState;
  }

  private createFullStateFromData(
    data: IFullState["data"]
  ): IFullState["state"] {
    return [];
  }

  private createFullDataFromState(
    fullStateState: IFullState["state"]
  ): IFullState["data"] {
    const data = fullStateState.map((rowState) => rowState.data);
    return data;
  }

  private createFullValuesFromState(
    fullStateState: IFullState["state"]
  ): IFullState["values"] {
    const data = fullStateState.map((rowState) => rowState.values);
    return data;
  }

  private setValuesFromCell(cellState: ICellState, newValues: IValues) {
    const newFullState = this.fullState?.state.map((rowState) => {
      const keyId = this.rowsDefinition.idKey;
      const isTheCurrentRow =
        rowState.data[keyId] === cellState.rowState.data[keyId];

      if (isTheCurrentRow) {
        const rowStateUpdated = rowState.state.map((_cellState) => {
          const cellUpdated = { ..._cellState };
          const isTheCurrentCell = _cellState.key === cellState.key;
          if (isTheCurrentCell) {
            cellUpdated.value = newValues.value;
            cellUpdated.values = newValues;
          }
          return cellUpdated;
        });

        return rowStateUpdated;
      }

      return { ...rowState };
    }) as IFullState["state"];

    const newFullData: IFullState["data"] =
      this.getFullDataFromState(newFullState);
    const newFullValues: IFullState["values"] =
      this.getFullValuesFromState(newFullState);

    const newFullRealState: IFullState = {
      ...this.fullState,
      data: newFullData,
      values: newFullValues,
      state: newFullState,

      setData: (data: IRowData[]) => {},
      setValues: (values: IObjectValues) => {},
    };

    return newFullRealState;
  }

  private setValueFromCell(
    cellState: ICellState,
    newValue: IValue
  ): IFullState {
    const newStateforFullState = this.fullState?.state.map((rowState) => {
      const keyId = this.rowsDefinition.idKey;
      const isTheCurrentRow =
        rowState.data[keyId] === cellState.rowState.data[keyId];

      if (isTheCurrentRow) {
        let stateForRowStateUpdated: IRowState["state"] = rowState.state.map(
          (_cellState) => {
            let cellUpdated: ICellState = { ..._cellState };
            const isTheCurrentCell = _cellState.key === cellState.key;
            if (isTheCurrentCell) {
              cellUpdated = { ...cellUpdated };

              cellUpdated.value = newValue;
              cellUpdated.values.value = newValue;
            }
            return cellUpdated;
          }
        );
        const dataForRowStateUpdated: IRowData = {};
        stateForRowStateUpdated.forEach((cellState) => {
          dataForRowStateUpdated[cellState.key] = cellState.getValue
            ? cellState.getValue(rowState)
            : cellState.value;
        });

        stateForRowStateUpdated = stateForRowStateUpdated.map(
          (cellState: ICellState) => {
            const newCellState = { ...cellState };
            if (cellState.getValue) {
              newCellState.value = cellState.getValue(dataForRowStateUpdated);
              newCellState.values.value = newCellState.value;
            }
            return newCellState;
          }
        );

        const rowStateUpdated = {
          ...rowState,
          data: dataForRowStateUpdated,
          state: stateForRowStateUpdated,
        };

        return rowStateUpdated;
      }

      return { ...rowState };
    }) as IFullState["state"];

    const newFullState: IFullState = {
      ...this.fullState!,
      state: newStateforFullState,
      data: newStateforFullState.map((rowState) => {
        const rowData: IRowData = {};
        rowState.state.forEach((cellState) => {
          rowData[cellState.key] =
            cellState.getValue?.(rowState.data) || cellState.value;
        });
        return rowData;
      }),
    };

    return newFullState;
  }

  private setValueFromRow(rowState: IRowState, newValue: IValue) {}

  private initFirstFullState() {
    const stateForFullState: IFullState["state"] = this.data.map((rowData) => {
      const stateForRowState: IRowState["state"] = this.columnsDefinition.map(
        (columnDefinition) => {
          const key = columnDefinition.key;

          const currentColumn = this.columnsDefinition.find(
            (column) => column.key === key
          ) as IColumnDefinition;

          const cellState = this.createCellStateFromCellData(
            currentColumn,
            rowData,
            key
          );

          return cellState;
        }
      );

      const rowState: IRowState = {
        data: rowData,

        values: [], // TODO: ¿create values from rowData?

        setData: (data: IRowData) => {},
        setValues: (values: IArrayValues) => {},

        state: stateForRowState,
        show: true,
      };

      rowState.state.forEach((cellState) => {
        cellState.rowState = rowState;
      });

      return rowState;
    });

    const newFullState: IFullState = {
      data: [],
      values: [],
      state: stateForFullState,
      setData: function (data: IRowData[]): void | Promise<void> {},
      setValues: function (values: IObjectValues): void | Promise<void> {},
    };

    this.fullState = newFullState;
  }

  private getFullDataFromState(stateOfFullState: IRowState[]): IRowData[] {
    const data = stateOfFullState.map((rowState) => rowState.data);
    return data;
  }

  private getFullValuesFromState(newFullState: IRowState[]): IArrayValues[] {
    throw [];
  }

  private subscribers: Set<ICallbackSubscriber> = new Set();

  subscribe(callback: ICallbackSubscriber) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private emit(coreData?: ICoreData) {
    this.subscribers.forEach((subscriber) => {
      subscriber(coreData || this.coreData!);
    });
  }

  public setFullState(fullState: IFullState) {
    this.fullState = fullState;
  }

  getValuesForFilter(columnDefinition_or_KeyName: IColumnDefinition | string) {
    const values = this.fullState?.data.map((rowData) => {
      const key =
        typeof columnDefinition_or_KeyName === "string"
          ? columnDefinition_or_KeyName
          : columnDefinition_or_KeyName.key;
      const value = rowData[key];
      return value;
    });
    return new Set(values);
  }

  filter(optionsValues: IOptions, column: IColumnDefinition) {
    const newStateForFullState: IRowState[] = this.fullState!.state.map(
      (rowState) => {
        const newRowState: IRowState = { ...rowState };
        newRowState.show = !!optionsValues.some((option) => {
          const cellState = rowState.state.find(
            (cellState) => cellState.key === column.key
          );
          return option.value === cellState!.value && option.checked;
        });
        return newRowState;
      }
    );

    const newFullState: IFullState = {
      ...this.fullState!,
      state: newStateForFullState,
      data: newStateForFullState.map((state) => {
        const rowData: IRowData = {};
        state.state.forEach((cellState) => {
          rowData[cellState.key] = cellState.value;
        });
        return rowData;
      }),
    };

    this.fullState = newFullState;

    this.emit(this.coreData);
  }
}

type ICallbackSubscriber = (state: ICoreData) => Promise<void> | void;
