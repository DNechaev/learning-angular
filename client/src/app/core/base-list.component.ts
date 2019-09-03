import { GridColumn, GridColumnList, GridSortMap, GridFilterMap } from '../shared/components/grid/grid.interfaces';

export class BaseListComponent {
  gridColumns: GridColumnList = [];
  gridRenderColumns: GridColumnList = [];
  gridAllowedSortFields: Array<string> = [];
  gridAllowedFilterFields: { [field: string]: Array<string> } = {};

  gridSearchString = '';
  gridFilterData: GridFilterMap = {};
  gridSortData: GridSortMap = {};

  gridSortColumn(column: GridColumn | string) {
    if (typeof column === 'string') { return; }
    if (this.gridAllowedSortFields.includes(column.field)) {
      const oldState = (column.field in this.gridSortData) ? this.gridSortData[column.field] : '';

      switch (oldState) {
        case '':
          this.gridSortData = {
            [column.field]: 'asc'
          };
          break;
        case 'asc':
          this.gridSortData = {
            [column.field]: 'desc'
          };
          break;
        default:
          this.gridSortData = {};
          break;
      }
    }
  }

  gridCalcColumns( corrector?: (GridColumnList) => GridColumnList ) {

    const columns = [...this.gridColumns];

    // Sort
    columns.forEach( (column: GridColumn | string) => {
      if (typeof column === 'string') { return; }
      column.sort = '';
      if (this.gridAllowedSortFields.includes(column.field)) {
        if (column.field in this.gridSortData) {
          column.sort = this.gridSortData[column.field];
        }
      }
    });

    // Filter
    columns.forEach( (column: GridColumn | string) => {
      if (typeof column === 'string') { return; }
      column.filtered = false;
      column.highlightMap = [];

      if (column.field in this.gridAllowedFilterFields) {
        const allowedFilterFieldAliases = this.gridAllowedFilterFields[column.field];

        allowedFilterFieldAliases.forEach((filterFieldAlias) => {
          if (
            filterFieldAlias in this.gridFilterData
            && typeof this.gridFilterData[filterFieldAlias] === 'string'
            && this.gridFilterData[filterFieldAlias].length
          ) {
            column.filtered = true;
            column.highlightMap.push(this.gridFilterData[filterFieldAlias]);
          }
        });

        if (this.gridSearchString.length) {
          column.filtered = true;
          column.highlightMap.push(this.gridSearchString);
        }

      }
    });

    this.gridRenderColumns = corrector ? corrector(columns) : columns;
  }

}
