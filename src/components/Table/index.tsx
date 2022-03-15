import { useState, useCallback, useEffect, SetStateAction } from "react";
import { AgGridReact } from "ag-grid-react";
import { useStore } from "../../store";

const Select = ({ data }: { data: any }) => {
  const { setRowsData } = useStore();

  return (
    <select
      value={data.valueSelected}
      onChange={(e) => {
        const rowUpdated = { ...data, valueSelected: parseInt(e.target.value) };
        setRowsData(rowUpdated);
      }}
    >
      {data.myOptions.map((item: any) => (
        <option value={item} key={item}>
          {item}
        </option>
      ))}
    </select>
  );
};

export const Table = () => {
  const { rowsData } = useStore();
  const [columnDefs] = useState([
    { field: "price" },
    {
      headerName: "myOptions",
      field: "myOptions",
      cellRenderer: (params: any) => {
        const { data } = params;
        return <Select data={data} />;
      },
    },
    {
      headerName: "Selección",
      field: "valueSelected",
      valueGetter: (params: any) => {
        return params.data.valueSelected * params.data.price;
      },
    },
  ]);
  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
      <AgGridReact rowData={rowsData} columnDefs={columnDefs}></AgGridReact>
    </div>
  );
};
