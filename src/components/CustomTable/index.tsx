import { TBody } from "./TBody";
import { THead } from "./THead";
import { IUseDataGridResult } from "./useDataTable";

export const CustomTable = ({ core }: { core: IUseDataGridResult }) => {
  return (
    <table>
      <THead columns={core.columnsDefinition} />
      <TBody rows={core.rowsDefinition} columns={core.columnsDefinition} />
    </table>
  );
};
