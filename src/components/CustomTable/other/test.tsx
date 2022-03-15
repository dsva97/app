import { useMemo, useState } from "react";

export const Test = () => {
  const [data, setData] = useState([]);
  const [columns] = useState([]);
  const [rows] = useState({});

  const gridTable = useMemo(() => {
    return new DataGrid(setData, data, columns);
  }, []);

  return <div>test</div>;
};
