import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridOptions, GridApi, GridReadyEvent, GetContextMenuItemsParams, DefaultMenuItem, MenuItemDef, Module } from 'ag-grid-community';
import { Component, inject } from '@angular/core';
import { IndexedDBService } from '../../../indexdb/services/indexdb.service';
import { GridStore } from './grid.store';
import { ModuleRegistry, themeMaterial } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';

ModuleRegistry.registerModules([AllEnterpriseModule as Module]);

interface IOlympicData {
    athlete: string;
    age: number;
    country: string;
    year: number;
    date: string;
    sport: string;
    gold: number;
    silver: number;
    bronze: number;
    total: number;
  }
  
interface ICellSelectionBounds {
    startIndex: number;
    endIndex: number;
    rowCount: number;
  }
  
type AddRowPosition = 'above' | 'below';
@Component({
    selector: 'transactions-grid',
    imports: [AgGridAngular],
    providers: [IndexedDBService],
    templateUrl: './transactiongrid.component.html',
})
export class TransactionGridComponent {
    constructor(private DBservice: IndexedDBService) {}
    private gridApi!: GridApi;
    store = inject(GridStore);

    async ngOnInit() {
        const list = await this.DBservice.getAllTransactions();
        this.store.set(list)
    }

    defaultColDef: ColDef = {
        flex: 1,
        minWidth: 100,
        resizable: true,
        sortable: true,
        filter: true
    };

    gridOptions: GridOptions = {
        pagination: true,
        paginationPageSize: 10,
        paginationPageSizeSelector: [10, 20, 50],
        domLayout: 'autoHeight',
        suppressHorizontalScroll: false,
        enableCellTextSelection: true,
        ensureDomOrder: true,
    };

    // Column Definitions: Defines the columns to be displayed.
    colDefs: ColDef[] = [
        {
            field: "category.name",
            headerName: "Catégorie",
            minWidth: 120
        },
        {
            field: "amount",
            headerName: "Montant",
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
            field: "name",
            headerName: "Nom",
            minWidth: 150
        },
        {
            field: "frequency",
            headerName: "Fréquence",
            minWidth: 100
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
        return [
          {
            name: `Delete ${rowLabel}`,
            action: () => this.deleteRows(startIndex, endIndex),
            icon: '<span class="ag-icon ag-icon-minus"></span>',
          },
          // Include default menu items (copy, paste, export, etc.)
          ...(params.defaultItems ?? []),
        ];
      };
      
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