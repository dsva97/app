import { GridTable } from "./core";
import { Thead } from "./Thead";
import { Tbody } from "./Tbody";
import classes from "./style.module.css";

export const SuperTable = ({
  gridTable,
}: {
  columnsDefinition: GridTable["columnsDefinition"];
  gridTable: GridTable;
  state: GridTable["fullState"];
}) => {
  return (
    <table className={classes.table}>
      <Thead gridTable={gridTable} />
      <Tbody gridTable={gridTable} />
    </table>
  );
};
