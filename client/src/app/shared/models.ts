export class Page {
  rows: Array<any>;
  count: number;
  page: number;
  pageSize: number;
}

export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  roles: Array<any>;
  ssid?: string;
}
