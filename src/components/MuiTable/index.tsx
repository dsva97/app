import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  {
    field: "age",
    headerName: "Plata",
    type: "number",
    width: 90,
  },
  {
    field: "values",
    headerName: "Values",
    renderCell: (params: GridValueGetterParams) => {
      console.log(params);
      return (
        <select>
          {params.row.values.map((value: number) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      );
    },
  },
  {
    field: "calculate",
    headerName: "Calculate",
    type: "number",
    width: 90,
    valueGetter: (params: GridValueGetterParams) => {
      return params.row.age * params.row.selectValue;
    },
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
];

interface MyRow {
  id: number;
  lastName: string;
  firstName: string;
  age: number;
  selectValue: number;
  values: number[];
}

const rows: MyRow[] = [
  {
    id: 1,
    lastName: "Snow",
    firstName: "Jon",
    age: 35,
    values: [1, 2, 3, 4, 5],
    selectValue: 1,
  },
  {
    id: 2,
    lastName: "Lannister",
    firstName: "Cersei",
    age: 42,
    values: [1, 2, 3, 4, 5],
    selectValue: 1,
  },
  {
    id: 3,
    lastName: "Lannister",
    firstName: "Jaime",
    age: 45,
    values: [1, 2, 3, 4, 5],
    selectValue: 1,
  },
  {
    id: 4,
    lastName: "Stark",
    firstName: "Arya",
    age: 16,
    values: [1, 2, 3, 4, 5],
    selectValue: 1,
  },
  {
    id: 5,
    lastName: "Targaryen",
    firstName: "Daenerys",
    age: 65,
    values: [1, 2, 3, 4, 5],
    selectValue: 1,
  },
  {
    id: 6,
    lastName: "Melisandre",
    firstName: "xasd",
    age: 150,
    values: [1, 2, 3, 4, 5],
    selectValue: 1,
  },
  {
    id: 7,
    lastName: "Clifford",
    firstName: "Ferrara",
    age: 44,
    values: [1, 2, 3, 4, 5],
    selectValue: 1,
  },
  {
    id: 8,
    lastName: "Frances",
    firstName: "Rossini",
    age: 36,
    values: [1, 2, 3, 4, 5],
    selectValue: 1,
  },
  {
    id: 9,
    lastName: "Roxie",
    firstName: "Harvey",
    age: 65,
    values: [1, 2, 3, 4, 5],
    selectValue: 1,
  },
];

export default function DataTable() {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}
