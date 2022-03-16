import { useEffect, useMemo, useState } from "react";
import { GridTable } from "../core";
import { ICellState, Key } from "../types";
import { Th } from "./Th";
import { IOption, IOptions } from "./Th/Filter";

export type ColumnState = ICellState[];
export type ColumnsState = { [key: Key]: ColumnState };
export type Options = {
  show: boolean;
  sorted: boolean;
  options: IOptions;
};
export type AllOptions = {
  [key: Key]: Options;
};

export const Thead = ({ gridTable }: { gridTable: GridTable }) => {
  const columnsStates: ColumnsState = useMemo(() => {
    const columnsStates: ColumnsState = {};
    gridTable.columnsDefinition.forEach((colDef) => {
      const columnState = gridTable.fullState!.state.map((rowState) => {
        return rowState.state.find(
          (cellState) => cellState.key === colDef.key
        ) as ICellState;
      });
      columnsStates[colDef.key] = columnState;
    });
    return columnsStates;
  }, [gridTable.fullState]);

  const createNewFiltersWithColumnsStates = (
    columnsStates: ColumnsState
  ): AllOptions => {
    const newFilters: AllOptions = {};
    Object.keys(columnsStates).forEach((key) => {
      const options: IOptions = columnsStates[key].map((cellState) => {
        return {
          value: cellState.value,
          label: cellState.value,
          checked: true,
        };
      });
      newFilters[key] = {
        options,
        sorted: false,
        show: false,
      };
    });
    return newFilters;
  };

  const [filters, setFilters] = useState<AllOptions>(
    createNewFiltersWithColumnsStates(columnsStates)
  );

  useEffect(() => {
    const newFilters = createNewFiltersWithColumnsStates(columnsStates);
    setFilters(newFilters);
  }, [columnsStates]);

  useEffect(() => {
    const hideFilters = () => {
      const newFilters: AllOptions = {};

      Object.keys(columnsStates).forEach((key) => {
        newFilters[key] = {
          options: filters[key].options,
          sorted: !!filters[key].sorted,
          show: false,
        };
      });

      setFilters(newFilters);
    };
    window.addEventListener("click", hideFilters);
    return () => window.removeEventListener("click", hideFilters);
  }, []);

  const dataForRender = useMemo(() => {
    const dataForRrender = gridTable.columnsDefinition.map((column) => {
      const applyOptions = (optionsValues: IOption[]) => {
        gridTable.filter(optionsValues, column);
      };

      const showFilter = () => {
        const newFilters: AllOptions = {};
        Object.keys(filters).map((key) => {
          const filter = filters[key];
          const newFilter = { ...filter };
          if (column.key === key) {
            newFilter.show = !newFilter.show;
          } else {
            newFilter.show = false;
          }
          newFilters[key] = newFilter;
        });
        setFilters(newFilters);
      };

      const goSorter = () => {
        const newFilters: AllOptions = {};

        Object.keys(filters).map((key) => {
          const filter = filters[key];
          const newFilter = { ...filter };
          if (column.key === key) {
            const newSorted = !newFilter.sorted;
            newFilter.sorted = newSorted;
          } else {
            newFilter.sorted = false;
          }
          newFilters[key] = newFilter;
        });

        gridTable.sorter(column);

        setFilters(newFilters);
      };

      const isShowFilter = filters[column.key].show;

      return { showFilter, goSorter, isShowFilter, applyOptions, column };
    });
    return dataForRrender;
  }, [filters]);

  return (
    <thead style={{ display: "flex", justifyContent: "stretch" }}>
      <tr style={{ width: "100%", display: "flex", justifyContent: "stretch" }}>
        {dataForRender.map(
          ({ column, isShowFilter, applyOptions, goSorter, showFilter }) => {
            return (
              <Th
                isShowFilter={isShowFilter}
                showFilter={showFilter}
                key={column.key}
                applyOptions={applyOptions}
                state={gridTable.fullState}
                goSorter={goSorter}
                column={column}
              />
            );
          }
        )}
      </tr>
    </thead>
  );
};
