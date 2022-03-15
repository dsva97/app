import { useMemo, useState } from "react";

export const Sandbox = () => {
  const [fullState, setFullState] = useState([]);

  const [filters, setFilters] = useState([]);

  useMemo(() => {}, [fullState]);

  return <div>index</div>;
};
