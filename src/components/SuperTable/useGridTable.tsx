import { useEffect, useMemo, useState } from "react";
import { GridTable, ICoreData } from "./core";
import { IDefinitions, IFullState, IRowsData } from "./types";

export const useGridTable = (props: {
  data: IRowsData;
  definitions: IDefinitions;
}) => {
  const [state, setState] = useState<IFullState | null>(null);
  const columnsDefinition = useMemo(
    () => props.definitions.columnsDefinition,
    []
  );

  const callbackSubscriber = (coreData: ICoreData) => {
    setState(coreData.fullState);
  };

  const gridTable = useMemo(() => {
    const gridTable = new GridTable(
      props.data,
      props.definitions,
      callbackSubscriber
    );
    return gridTable;
  }, []);

  useEffect(() => {
    const unsubscribe = gridTable.subscribe(callbackSubscriber);
    return unsubscribe;
  }, []);

  return {
    columnsDefinition,
    state,
    gridTable,
  };
};
