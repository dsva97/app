// import MuiTable from "./components/MuiTable";
import { CustomTable } from "./components/CustomTable";
import {
  IRowsData,
  ICellParams,
  IValues,
  IColumnsDefinitionHook,
} from "./components/CustomTable/useDataTable/types";
import { useDataTable } from "./components/CustomTable/useDataTable";
import { SuperTable } from "./components/SuperTable";
import { TestSuperTable } from "./components/SuperTable/test";

export const columnsDefinition: IColumnsDefinitionHook = [
  {
    key: "name",
    render: ({ cellDefinition: { values, setValues } }) => {
      return (
        <input
          value={values.value}
          onChange={(e) => {
            setValues({
              ...values,
              value: e.target.value,
            });
          }}
        />
      );
    },
  },
  {
    key: "age",
    render: ({ cellDefinition }) => {
      return (
        <input
          value={cellDefinition.values.value}
          onChange={(e) => {
            cellDefinition.setValues({
              ...cellDefinition.values,
              value: e.target.value,
            });
          }}
        />
      );
    },
  },
];

const rowsData: IRowsData = [
  {
    id: 15,
    name: "Darwin",
    age: "23",
  },
  {
    id: 17,
    name: "Stalin",
    age: "24",
  },
];

export const MyTable = () => {
  const gridCore = useDataTable({ columnsDefinition, rowsData });
  // console.log(gridCore.rowsData, gridCore.rowsDefinition);
  return <CustomTable core={gridCore} />;
};

function App() {
  return (
    <div>
      <h1>Demo</h1>

      <hr />
      <TestSuperTable />
      <hr />
      {/* <MyTable /> */}
      <hr />
      {/* <MuiTable /> */}
      <hr />
      {/* <Table /> */}
    </div>
  );
}

export default App;
