import { Component } from '@angular/core';
import { IndexedDBService } from '../../features/indexdb/services/indexdb.service';
import { CommonModule } from '@angular/common';



@Component({
    selector: 'app-home',
    imports : [IndexedDBService, CommonModule],
    templateUrl:'./home.component.html'
  })
  export class HomeComponent {
    constructor(private DBservice: IndexedDBService) { }

    ngOnInit(): void {
        this.DBservice.init().then(() => {
            console.log('Database initialized');
            this.DBservice.getAllTransactions().then((transactions) => {
                console.log('Transactions:', transactions);
            });
        });
    }

  }
  