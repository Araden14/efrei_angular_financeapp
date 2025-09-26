import { Component, inject } from '@angular/core';
import { TransactionformComponent } from '../../../features/transactions/components/form/transactionform.component';
import { TransactionGridComponent } from '../../../features/transactions/components/grid/transactiongrid.component';
import { Navbar } from '../../navbar/navbar.component';
import { CategoryService } from '../../../shared/services/category.service';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-home',
  standalone:true,
  imports: [TransactionformComponent, TransactionGridComponent, Navbar],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private categoryService = inject(CategoryService);

  ngOnInit() {
    console.log(this.categoryService.getCategories())
  }
}