import { useCallback } from "react";

export interface IOption {
  checked: boolean;
  label: string;
  value: any;
}

export type IOptions = IOption[];
export type ISetOptions =
  | React.Dispatch<React.SetStateAction<IOptions>>
  | ((options: IOptions) => void);

export interface IFilterProps {
  options: IOptions;
  setOptions: ISetOptions;
}

export const Filter = ({ options, setOptions }: IFilterProps) => {
  const getChanger = useCallback(
    (option: IOption) => {
      const newOptions = [...options].map((_option) => {
        if (option.value === _option.value) {
          return {
            ..._option,
            checked: !_option.checked,
          };
        }
        return _option;
      });
      setOptions(newOptions);
    },
    [options]
  );
  return (
    <div
      style={{
        position: "absolute",
        background: "white",
        top: "100%",
        right: "0",
        padding: ".25em",
        boxShadow: "0px 0px 26px 1px rgba(0,0,0,0.5)",
        zIndex: 10,
        width: "auto",
        flexDirection: "column",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {options.map((option) => {
        return (
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              getChanger(option);
            }}
            key={option.label}
          >
            <input
              style={{
                fontSize: "1rem",
                width: "1rem",
                height: "1rem",
                cursor: "pointer",
                marginRight: ".5em",
                flexShrink: 0,
              }}
              type="checkbox"
              checked={option.checked}
              value={option.value}
              onChange={(e) => {
                e.stopPropagation();
                getChanger(option);
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <label
              style={{
                whiteSpace: "nowrap",
                cursor: "pointer",
                marginRight: ".25em",
              }}
            >
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
};
