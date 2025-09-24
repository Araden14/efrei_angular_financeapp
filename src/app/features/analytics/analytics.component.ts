import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgCharts } from 'ag-charts-angular';
import { IndexedDBService } from "../indexdb/services/indexdb.service";
import { Transaction } from "../indexdb/models/transaction.model";
import { Navbar } from "../navbar/navbar.component";

interface MonthlyData {
  month: string;
  amount: number;
}

@Component({
    selector: 'analytics',
    templateUrl: './analytics.component.html',
    standalone: true,
    imports: [CommonModule, AgCharts, Navbar],
})
export class AnalyticsComponent implements OnInit {
  monthlyExpenses: MonthlyData[] = [];
  monthlyIncome: MonthlyData[] = [];
  expensesChartOptions: any;
  incomeChartOptions: any;

  constructor(private dbService: IndexedDBService) {}

  async ngOnInit() {
    await this.loadMonthlyData();
    this.initializeCharts();
  }

  private async loadMonthlyData() {
    try {
      const transactions = await this.dbService.getAllTransactions();

      // Process expenses
      const expensesByMonth = new Map<string, number>();
      const incomeByMonth = new Map<string, number>();

      transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (transaction.type === 'expense') {
          const currentAmount = expensesByMonth.get(monthKey) || 0;
          expensesByMonth.set(monthKey, currentAmount + transaction.amount);
        } else if (transaction.type === 'income') {
          const currentAmount = incomeByMonth.get(monthKey) || 0;
          incomeByMonth.set(monthKey, currentAmount + transaction.amount);
        }
      });

      // Convert to arrays and sort by date
      const processMonthlyData = (dataMap: Map<string, number>) => {
        return Array.from(dataMap.entries())
          .map(([monthKey, amount]) => {
            const [year, month] = monthKey.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            return {
              month: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
              amount: amount
            };
          })
          .sort((a, b) => {
            const dateA = new Date(a.month + ' 1');
            const dateB = new Date(b.month + ' 1');
            return dateA.getTime() - dateB.getTime();
          });
      };

      this.monthlyExpenses = processMonthlyData(expensesByMonth);
      this.monthlyIncome = processMonthlyData(incomeByMonth);

    } catch (error) {
      console.error('Error loading monthly data:', error);
    }
  }

  private initializeCharts() {
    // Expenses chart - Dark Red
    this.expensesChartOptions = {
      autoSize: true,
      data: this.monthlyExpenses,
      background: {
        fill: 'transparent',
      },
      series: [
        {
          type: 'bar',
          xKey: 'month',
          yKey: 'amount',
          yName: 'Amount (€)',
          fill: '#dc2626', // dark red
          stroke: '#b91c1c',
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Month',
          },
          label: {
            color: '#e2e8f0',
          },
        },
        {
          type: 'number',
          position: 'left',
          title: {
            text: 'Amount (€)',
          },
          label: {
            color: '#e2e8f0',
          },
        },
      ],
    };

    // Income chart - Emerald Green
    this.incomeChartOptions = {
      autoSize: true,
      data: this.monthlyIncome,
      background: {
        fill: 'transparent',
      },
      series: [
        {
          type: 'bar',
          xKey: 'month',
          yKey: 'amount',
          yName: 'Amount (€)',
          fill: '#10B981', // emerald green
          stroke: '#059669',
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Month',
          },
          label: {
            color: '#e2e8f0',
          },
        },
        {
          type: 'number',
          position: 'left',
          title: {
            text: 'Amount (€)',
          },
          label: {
            color: '#e2e8f0',
          },
        },
      ],
    };
  }
}
