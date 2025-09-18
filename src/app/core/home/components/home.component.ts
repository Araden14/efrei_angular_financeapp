import { Component } from '@angular/core';
import { TransactionformComponent } from '../../../features/transactions/components/form/transactionform.component';
import { TransactionGridComponent } from '../../../features/transactions/components/grid/transactiongrid.component';
@Component({
  selector: 'app-home',
  standalone:true,
  imports: [TransactionformComponent, TransactionGridComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
}