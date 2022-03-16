import { useEffect, useMemo, useState } from "react";
import { GridTable } from "../../core";
import { Filter, IOption, IOptions } from "./Filter";
import { ICellState, IColumnDefinition } from "../../types";
import { ColumnsState, ColumnState, Options } from "..";

export interface IThProps {
  state: GridTable["fullState"];
  column: IColumnDefinition;
  applyOptions: (optionsValues: IOption[]) => void;
  showFilter: () => void;
  isShowFilter: boolean;
  goSorter: () => void;
}
export const Th = ({
  state,
  column,
  applyOptions,
  showFilter,
  isShowFilter,
  goSorter,
}: IThProps) => {
  const valueCellsOfColumn = useMemo(() => {
    return state?.state
      .map((rowState) => {
        const cellOfColumn = rowState.state.find((cellState) => {
          return cellState.key === column.key;
        }) as ICellState;
        return cellOfColumn;
      })
      .map((cell) => cell.value);
  }, [state?.state]);

  const optionsCalculated = useMemo(() => {
    const setCellsOfColumns = new Set(valueCellsOfColumn);
    const options = Array.from(setCellsOfColumns).map((value) => {
      return {
        value,
        label: value,
        checked: true,
      };
    });
    return options;
  }, [valueCellsOfColumn]);

  const [options, setOptions] = useState(optionsCalculated);

  useEffect(() => {
    const optMerged = optionsCalculated.map((opt, index) => {
      const newOpt = {
        value: opt.value,
        label: opt.label,
        checked: options[index]?.checked || false,
      };
      return newOpt;
    });
    setOptions(optMerged);
  }, [optionsCalculated]);

  const _setOptions = (__options: IOptions) => {
    applyOptions(__options);
    setOptions(__options);
  };

  const onClick: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    showFilter();
  };

  return (
    <th
      style={{
        display: "flex",
        position: "relative",
        cursor: column.sort ? "pointer" : "",
        minWidth: column.width,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div>{column.label}</div>
        <div
          style={{
            width: "auto",
            display: "inline-flex",
            flexShrink: 0,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {column.sort ? (
            <span onClick={goSorter}>{column.sorted ? "🔺" : "🔻"}</span>
          ) : null}
          {column.filter ? <span onClick={onClick}>🝖</span> : null}
        </div>
      </div>
      {isShowFilter ? (
        <Filter options={options} setOptions={_setOptions} />
      ) : null}
    </th>
  );
};
