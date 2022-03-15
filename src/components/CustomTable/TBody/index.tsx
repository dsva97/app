import classesTable from "../style.module.css";
import { IColumnDefinition, IRowData, IRowsDefinition } from "../useDataTable/types";

export interface ITBodyProps {
  columns: IColumnDefinition[];
  rows: IRowsDefinition;
}
export const TBody = ({ rows, columns }: ITBodyProps) => {
  return (
    <tbody>
      {
      rows.map((rowDefinition) => {
        return (
          <tr key={rowDefinition.id.values.value}>
            {Object.keys(rowDefinition)
              .filter((key) => rowDefinition[key].show)
              .map((key) => {
                const cellParams = {
                  cellDefinition: rowDefinition[key],
                  columnDefinition: columns.find(
                    (column) => column.key === key
                  ),
                  rowDefinition,
                  rowsDefinition: rows,
                  data: undefined,
                  rowData: {},
                  rowsData: [],
                  columnsDefinition: columns,
                }
                return (
                  <td key={key} className={`${classesTable.td}`}>
                    {rowDefinition[key].render(cellParams)}
                  </td>
                );
              })}
          </tr>
        );
      })}
    </tbody>
  );
};
