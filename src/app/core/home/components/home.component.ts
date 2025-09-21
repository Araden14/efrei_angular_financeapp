import { Component } from '@angular/core';
import { TransactionformComponent } from '../../../features/transactions/components/form/transactionform.component';
import { TransactionGridComponent } from '../../../features/transactions/components/grid/transactiongrid.component';
import { Navbar } from '../../../features/navbar/navbar.component';
@Component({
  selector: 'app-home',
  standalone:true,
  imports: [TransactionformComponent, TransactionGridComponent, Navbar],
  templateUrl: './home.component.html'
})
export class HomeComponent {
}