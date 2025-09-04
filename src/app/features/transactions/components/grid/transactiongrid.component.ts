import { AgGridAngular } from "ag-grid-angular";
import type { ColDef, GridOptions } from 'ag-grid-community'; // Column Definition Type Interface
import { Component, inject} from "@angular/core";
import { IndexedDBService } from "../../../indexdb/services/indexdb.service";
import { GridStore } from "./grid.store";
import { themeMaterial } from "ag-grid-community";

@Component({
    selector: 'transactions-grid',
    imports: [AgGridAngular],
    providers: [IndexedDBService],
    templateUrl: './transactiongrid.component.html'
})

export class TransactionGridComponent {
    constructor(private DBservice: IndexedDBService) {}
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
        theme: themeMaterial
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
}