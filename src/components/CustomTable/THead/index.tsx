import { IColumnDefinition } from "../useDataTable/types";
import classesTable from "../style.module.css";

export type ITHeadProps = {
  columns: IColumnDefinition[];
};
export const THead = ({ columns }: ITHeadProps) => {
  return (
    <thead>
      <tr>
        {columns
          .filter((column) => column.show)
          .map((column) => (
            <th key={column.key} className={`${classesTable.th}`}>
              {column.values.title}
            </th>
          ))}
      </tr>
    </thead>
  );
};
