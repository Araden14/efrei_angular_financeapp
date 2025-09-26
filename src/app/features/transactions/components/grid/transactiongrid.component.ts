import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridOptions, GridApi, GridReadyEvent, GetContextMenuItemsParams, DefaultMenuItem, MenuItemDef, ChartType, ICellRendererParams, ITooltipParams } from 'ag-grid-community';
import { Component, inject, OnInit } from '@angular/core';
import { IndexedDBService } from '../../../indexdb/services/indexdb.service';
import { GridStore } from './grid.store';
import { ModuleRegistry } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import { CategoryIconPipe } from '../../../../shared/pipes/category-icon.pipe';
import { ChartToolPanelsDef } from 'ag-grid-community';
import { IntegratedChartsModule } from 'ag-grid-enterprise';
import { AgChartsModule } from 'ag-charts-angular';
import { AgChartsEnterpriseModule } from 'ag-charts-enterprise';

ModuleRegistry.registerModules([AllEnterpriseModule, IntegratedChartsModule.with(AgChartsEnterpriseModule)]);

interface ICellSelectionBounds {
    startIndex: number;
    endIndex: number;
    rowCount: number;
  }
@Component({
    selector: 'app-transactions-grid',
    imports: [AgGridAngular, CategoryIconPipe, AgChartsModule],
    providers: [IndexedDBService],
    templateUrl: './transactiongrid.component.html',
})
export class TransactionGridComponent implements OnInit {
    private DBservice = inject(IndexedDBService);
    private gridApi!: GridApi;
    store = inject(GridStore);
    private categoryIconPipe = new CategoryIconPipe();

    async ngOnInit() {
        const list = await this.DBservice.getAllTransactions();
        this.store.set(list)
    }

    defaultColDef: ColDef = {
        flex: 1,
        minWidth: 100,
        resizable: true,
        sortable: true,
        filter: true,

    };

    gridOptions: GridOptions = {
        rowHeight:40,
        pagination: true,
        suppressHorizontalScroll: false,
        ensureDomOrder: true,
        tooltipShowDelay: 0,
        tooltipHideDelay: 2000,
        enableCharts: true,
        cellSelection: true,
    };
    chartToolPanelsDef: ChartToolPanelsDef = {
      defaultToolPanel: "settings",
    };
    // Column Definitions: Defines the columns to be displayed.
    colDefs: ColDef[] = [
        {
            field: "name",
            headerName: "Name",
            minWidth: 150
        },
        {
            field: "category.icon",
            headerName: "Category",
            minWidth: 120,
            cellRenderer: (params: ICellRendererParams) => {
                const iconName = params.value;
                const emoji = this.categoryIconPipe.transform(iconName);
                return `<span style="font-size: 18px;">${emoji}</span>`;
            },
            tooltipValueGetter: (params: ITooltipParams) => {
                return params.data?.category?.name || '';
            }
        },
        {
            field: "amount",
            headerName: "Amount",
            minWidth: 100,
            valueFormatter: (params) => `${params.value}€`
        },
        {
            field: "date",
            headerName: "Date",
            minWidth: 120,
            valueFormatter: (params) => new Date(params.value).toLocaleDateString('fr-FR')
        },
        {
            field: "type",
            headerName: "Type",
            minWidth: 100
        }
    ];

    protected async onGridReady(params: GridReadyEvent) {
        // Set API
        this.gridApi = params.api;
    }

    private getCellSelectionBounds(
        params: GetContextMenuItemsParams
      ): ICellSelectionBounds {
        // Get cell ranges from the grid API
        const cellRanges = this.gridApi.getCellRanges();
    
        // Fallback to clicked row if no cell range is selected
        if (!cellRanges || !cellRanges[0]?.startRow || !cellRanges[0]?.endRow) {
          const rowIndex = params.node?.rowIndex || 0;
          return { startIndex: rowIndex, endIndex: rowIndex, rowCount: 1 };
        }
    
        // Extract row indices from the first cell range
        const cellRangeStartRowIndex = cellRanges[0].startRow.rowIndex;
        const cellRangeEndRowIndex = cellRanges[0].endRow.rowIndex;
    
        // Calculate total rows in selection (inclusive)
        const rowCount =
          Math.abs(cellRangeEndRowIndex - cellRangeStartRowIndex) + 1;
    
        // Normalize indices since selection can be made in either direction
        const startIndex = Math.min(cellRangeStartRowIndex, cellRangeEndRowIndex);
        const endIndex = Math.max(cellRangeStartRowIndex, cellRangeEndRowIndex);
    
        // Return normalized selection bounds
        return { startIndex, endIndex, rowCount };
      }
    
      // Clear selection and focus on the first new row for immediate editing
      private startEditingCell(insertIndex: number, firstColumn: string) {
        this.gridApi.clearCellSelection();
        this.gridApi.setFocusedCell(insertIndex, firstColumn);
        this.gridApi.startEditingCell({
          rowIndex: insertIndex,
          colKey: firstColumn,
        });
      }

    private confirmDelete(startIndex: number, endIndex: number, rowCount: number): void {
        const isMultiple = rowCount > 1;
        const confirmTitle = 'Delete Transaction' + (isMultiple ? 's' : '');
        const confirmMessage = isMultiple 
            ? `Are you sure you want to delete these ${rowCount} transactions? This action cannot be undone.`
            : 'Are you sure you want to delete this transaction? This action cannot be undone.';

        if (confirm(`${confirmTitle}\n\n${confirmMessage}`)) {
            this.deleteRows(startIndex, endIndex);
        }
    }

    private deleteRows(startIndex: number, endIndex: number) {
    // Collect row data within the specified range
    const rowDataToRemove = [];
    for (let i = startIndex; i <= endIndex; i++) {
        const node = this.gridApi.getDisplayedRowAtIndex(i);
        if (node?.data) {
        rowDataToRemove.push(node.data);
        this.DBservice.deleteTransaction(node.data.id)
        }
    }

    // Skip removal if no valid rows found
    if (rowDataToRemove.length === 0) return;

    // Remove collected rows from the grid
    this.gridApi.applyTransaction({ remove: rowDataToRemove });

    // Clear selection after deletion
    this.gridApi.clearCellSelection();
    }
    
    

    protected getContextMenuItems = (
        params: GetContextMenuItemsParams
      ): (DefaultMenuItem | MenuItemDef)[] => {
        // Get selection bounds (either from cell range or clicked row)
        const { startIndex, endIndex, rowCount } =
          this.getCellSelectionBounds(params);

        // Create pluralized label for menu items
        const rowLabel = `${rowCount} Row${rowCount !== 1 ? 's' : ''}`;

        // Build context menu with row manipulation options
        const menuItems: (DefaultMenuItem | MenuItemDef)[] = [
          {
            name: `Delete ${rowLabel}`,
            action: () => this.confirmDelete(startIndex, endIndex, rowCount),
            icon: '<span class="ag-icon ag-icon-minus"></span>',
          },
        ];

        // Add chart menu items if cells are selected
        const cellRanges = this.gridApi.getCellRanges();
        if (cellRanges && cellRanges.length > 0) {
          menuItems.push({
            name: 'Chart Range',
            subMenu: [
              {
                name: 'Bar Chart',
                action: () => this.createChart('groupedColumn'),
              },
              {
                name: 'Line Chart',
                action: () => this.createChart('line'),
              },
              {
                name: 'Pie Chart',
                action: () => this.createChart('pie'),
              },
              {
                name: 'Area Chart',
                action: () => this.createChart('area'),
              },
            ],
            icon: '<span class="ag-icon ag-icon-chart"></span>',
          });
        }

        // Include default menu items (copy, paste, export, etc.)
        menuItems.push(...(params.defaultItems ?? []));

        return menuItems;
      };

      private createChart(chartType: ChartType) {
        const cellRanges = this.gridApi.getCellRanges();
        if (cellRanges && cellRanges.length > 0) {
          this.gridApi.createRangeChart({
            cellRange: cellRanges[0],
            chartType: chartType,
          });
        }
      }
      
      private addRows(rowCount: number, startIndex?: number, endIndex?: number) {
        // Create empty row objects for insertion
        const newRows = Array.from({ length: rowCount }, () => ({}));
    
        // Determine insertion point
        const insertIndex = startIndex || endIndex || 0;
    
        // Insert rows at the specified index
        const result = this.gridApi.applyTransaction({
          add: newRows,
          addIndex: insertIndex,
        });
    
        // If rows are added, focus on and start editing first new cell
        if (result && result?.add?.length > 0) {
          // Wait for next frame to ensure grid has processed the transaction
          requestAnimationFrame(() => {
            this.startEditingCell(insertIndex, this.colDefs[0].field || '');
          });
        }
      }
}