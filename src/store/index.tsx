import create from "zustand";

export interface RowData {
  id: number;
  make: string;
  model: string;
  price: number;
  myOptions: number[];
  valueSelected: number;
}

export interface Store {
  rowsData: RowData[];
  setRowsData: (rowsData: RowData) => void;
}

export const useStore = create<Store>((set) => ({
  rowsData: [
    {
      id: 15,
      make: "Toyota",
      model: "Celica",
      price: 35,
      myOptions: [1, 2, 3, 4],
      valueSelected: 1,
    },
    {
      id: 19,
      make: "Ford",
      model: "Mondeo",
      price: 32,
      myOptions: [3, 4, 7],
      valueSelected: 3,
    },
    {
      id: 29,
      make: "Porsche",
      model: "Boxter",
      price: 72,
      myOptions: [1, 5, 6],
      valueSelected: 1,
    },
  ],
  setRowsData: (rowData: RowData) =>
    set((state) => ({
      ...state,
      rowsData: state.rowsData.map((row) =>
        row.id === rowData.id ? rowData : row
      ),
    })),
}));
