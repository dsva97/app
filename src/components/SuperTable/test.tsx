import { SuperTable } from ".";
import { useGridTable } from "./useGridTable";
import { ICellState, IDefinitions, IRowData } from "./types";
import { useState } from "react";

const _data: IRowData[] = [
  {
    id: 1,
    name: "John",
    age: "20",
  },
  {
    id: 2,
    name: "Peter",
    age: "30",
  },
  {
    id: 3,
    name: "Amy",
    age: "40",
  },
  {
    id: 4,
    name: "Faron",
    age: "30",
  },
  {
    id: 5,
    name: "Shady",
    age: "30",
  },
];

const definitions: IDefinitions = {
  rowsDefinition: {
    idKey: "id",
    rowHeight: "50px",
    rowEvents: {},
    rowRender: ({ children }) => {
      return <span>{children}</span>;
    },

    rowHeadHeight: "50px",
    rowHeadEvents: {},
    rowHeadRender: ({ children }) => {
      return <span>{children}</span>;
    },
  },
  columnsDefinition: [
    {
      key: "id",
      order: 0,
      label: "ID",
      filter: true,
      sort: true,
      show: true,

      columnEvents: {},

      events: {},
      render: (params) => <span>{params.value}</span>,

      width: "20%",
      cellHeadEvents: {},
      cellHeadRender: () => <span>{"¡ ID !"}</span>,
    },
    {
      key: "name",
      order: 1,
      label: "NAME",
      filter: true,
      sort: true,
      show: true,

      columnEvents: {},

      events: {},
      render: (params) => {
        return (
          <input
            value={params.value}
            onChange={(e) => params.setValue(e.target.value)}
          />
        );
      },

      width: "20%",
      cellHeadEvents: {},
      cellHeadRender: () => <span>{"¡ NAME !"}</span>,
    },
    {
      key: "age",
      order: 2,
      label: "AGE",
      filter: true,
      sort: true,
      show: true,

      columnEvents: {},

      events: {},
      render: (params) => <span>{params.value}</span>,

      width: "20%",
      cellHeadEvents: {},
      cellHeadRender: () => <span>{"¡ AGE !"}</span>,
    },
    {
      key: "title",
      order: 3,
      label: "TITLE",
      filter: true,
      sort: true,
      show: true,
      columnEvents: {},

      events: {},
      getValue: (rowData) => {
        return `${rowData.name} - ${rowData.age}`;
      },
      render: ({ value }) => {
        return <strong>{value}</strong>;
      },

      width: "20%",
      cellHeadEvents: {},
      cellHeadRender: () => <span>{"¡ TITLE !"}</span>,
    },
  ],
};

export const TestSuperTable = () => {
  const { state, columnsDefinition, gridTable } = useGridTable({
    data: _data,
    definitions,
  });
  const [discount, setDiscount] = useState(0);
  const applyDiscount = () => {
    state?.state
      .filter((rowState) => rowState.show)
      .forEach((rowState) => {
        const cellAge = rowState.state.find(
          (cellState) => cellState.key === "age"
        );
        if (cellAge) {
          cellAge.setValue(Number(cellAge.value) - discount);
        }
      });
  };

  const forTextArea = JSON.stringify(
    gridTable.fullState!.state.map((rowState) => {
      if (rowState.show) {
        const data: IRowData = {};

        rowState.state.forEach((cellState) => {
          data[cellState.key] = cellState.value;
        });
        return data;
      }
      return rowState.data;
    }),
    null,
    3
  );

  return (
    <div>
      <div>
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
        />
        <button onClick={applyDiscount}>Apply discount</button>
      </div>
      <SuperTable
        state={state!}
        gridTable={gridTable}
        columnsDefinition={columnsDefinition}
      />
      <textarea value={forTextArea} disabled></textarea>
    </div>
  );
};
