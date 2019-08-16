
export const enum GridActionType {
  SELECT_ROW = 'SELECT_ROW',
  SELECT_CELL = 'SELECT_CELL',
  EDIT = 'EDIT',
  DELETE = 'DELETE'
}


export interface GridRowActionEvent {
  action: string;
  record: object;
  records: Array<object>;
  index: number;
}

export interface GridCellActionEvent {
  action: string;
  record: object;
  records: Array<object>;
  index: number;
  value: any;
  valueFormatted: string;
  column: GridColumn;
}

export interface GridFormatterEvent {
  value: any;
  record?: object;
  index?: number;
  records?: Array<any>;
  column?: GridColumn;
}

type FunctionFormatter = (GridFormatterEvent) => string;

export interface GridColumn {
  field: string;
  title?: string;
  style?: string;
  class?: string;
  formatter?: FunctionFormatter;
}
