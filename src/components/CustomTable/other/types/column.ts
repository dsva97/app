export interface IColumnDefinition {
    key: string;
    filter: boolean;
    sort: boolean;
    show: boolean;
    render: () => React.ReactNode;
    events: {};
    eventsColumn: {};
}

export type IColumnsDefinition = IColumnDefinition[];
