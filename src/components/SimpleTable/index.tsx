import { useCallback, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { getDefaultColumnDefs, defaultRowsData } from "./data";

export const SimpleTable = () => {
  const gridRef = useRef(null);
  const [gridApi, setGridApi] = useState<any>();
  const [rowsData, setRowsData] = useState(defaultRowsData);
  const [columnDefs, setColumnDefs] = useState(
    getDefaultColumnDefs(gridRef, rowsData)
  );
  const [discount, setDiscount] = useState(0);
  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };
  const applyDiscount = (params: any) => {
    const { data } = params;
    const { valueSelected } = data;
    const { price } = data;
    const newPrice = price * valueSelected;
    return newPrice;
  };

  const onCellValueChanged = (params: any) =>
    console.log("onCellValueChanged", params);
  const onFilterOpened = (params: any) => console.log("onFilterOpened", params);
  const onFilterModified = (params: any) =>
    console.log("onFilterModified", params);
  const onFilterChanged = (params: any) =>
    console.log("onFilterChanged", params);

  return (
    <div>
      <input
        value={discount}
        onChange={(e) => setDiscount(parseInt(e.target.value))}
        type="number"
      />
      <button onClick={applyDiscount}>Apply</button>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          onCellValueChanged={onCellValueChanged}
          onFilterOpened={onFilterOpened}
          onFilterModified={onFilterModified}
          onFilterChanged={onFilterChanged}
          onGridReady={onGridReady}
          rowData={rowsData}
          columnDefs={columnDefs}
        ></AgGridReact>
      </div>
    </div>
  );
};
