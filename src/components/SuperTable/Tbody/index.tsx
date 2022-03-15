import { GridTable } from "../core";
import { Tr } from "./Tr";

export const Tbody = ({ gridTable }: { gridTable: GridTable }) => {
  return (
    <tbody style={{ flexDirection: "column" }}>
      {(gridTable.fullState?.state || [])
        .filter((rowState) => !!rowState.show)
        .map((rowState) => {
          return (
            <Tr
              key={rowState.data.id}
              rowState={rowState}
              gridTable={gridTable}
            />
          );
        })}
    </tbody>
  );
};
