import { useEffect, useState } from "react";

export const defaultColumnDefs: { [key: string]: any }[] = [
  { field: "price" },
  {
    headerName: "myOptions",
    field: "myOptions",
    cellRenderer: (params: any) => {
      const { data } = params;
      return <span>{"asds"}</span>;
    },
  },
  {
    headerName: "Final Price",
    valueGetter: (params: any) => {
      return (
        params.data.valueSelected * params.data.price - params.data.discount
      );
    },
  },
].map((x) => ({ ...x, filter: true }));

interface CurrentGrid extends HTMLElement {
  api: {
    applyTransaction: (transaction: any) => void;
  };
}
interface GridElement extends Omit<React.MutableRefObject<null>, "current"> {
  current: null | CurrentGrid;
}

export const getDefaultColumnDefs = (gridRef: GridElement, rowsData: any[]) => {
  return defaultColumnDefs.concat({
    field: "discount",
    // cellRenderer: "discountCellRenderer",
    cellRenderer: (params: any) => {
      const { data } = params;
      const [value, setValue] = useState(data.discount);
      const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(parseInt(e.target.value));
      };
      useEffect(() => {
        const rowUpdated = {
          ...params.data,
          discount: value,
        };
        const result = gridRef.current?.api?.applyTransaction({
          upate: [rowUpdated],
        });
        console.log(result, rowUpdated);
      }, [value]);
      console.log("params", params);
      return <input value={value} onChange={onChange} />;
    },
  });
};

export const defaultRowsData = [
  {
    id: 15,
    make: "Toyota",
    model: "Celica",
    price: 35,
    myOptions: [1, 2, 3, 4],
    valueSelected: 1,
    discount: 0,
  },
  {
    id: 19,
    make: "Ford",
    model: "Mondeo",
    price: 32,
    myOptions: [3, 4, 7],
    valueSelected: 3,
    discount: 0,
  },
  {
    id: 29,
    make: "Porsche",
    model: "Boxter",
    price: 72,
    myOptions: [1, 5, 6],
    valueSelected: 1,
    discount: 0,
  },
];
