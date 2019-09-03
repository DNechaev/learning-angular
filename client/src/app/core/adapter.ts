export interface Adapter<T> {
  input(item: any): T;
  output(item: T): any;
}
