import { GridTable } from "./core";
import { ICellParams, ICellState, IEmptyCellParams } from "./types";

export const SuperTable = ({
  columnsDefinition,
  state,
}: {
  columnsDefinition: GridTable["columnsDefinition"];
  state: GridTable["fullState"];
}) => {
  return (
    <table>
      <thead>
        <tr>
          {columnsDefinition.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(state?.state || []).map((rowState) => {
          return (
            <tr key={rowState.data.id}>
              {columnsDefinition.map((column) => {
                const cellState = rowState.state.find((cellState) => {
                  return cellState.key === column.key;
                });

                if (cellState) {
                  const cellParams: ICellParams = {
                    fullState: state,
                    value: cellState.value,
                    values: cellState.values,
                    setValue: cellState.setValue,
                    setValues: cellState.setValues,
                    rowState: cellState.rowState,
                  } as ICellParams;

                  return (
                    <td key={cellState.key}>{cellState.render(cellParams)}</td>
                  );
                } else {
                  return <td key={column.key}>{column.value}</td>;
                }
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
