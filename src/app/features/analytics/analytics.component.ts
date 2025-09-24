import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AgCharts } from 'ag-charts-angular';
import { IndexedDBService } from "../indexdb/services/indexdb.service";
import { Transaction } from "../indexdb/models/transaction.model";
import { Navbar } from "../navbar/navbar.component";
import { CategoryIconPipe } from "../../shared/pipes/category-icon.pipe";

interface MonthlyData {
  month: string;
  expenses: number;
  income: number;
}

interface CategorySlice {
  category: string;
  amount: number;
  icon: string;
  iconSymbol: string;
  percentage: number;
}

@Component({
    selector: 'analytics',
    templateUrl: './analytics.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, AgCharts, Navbar],
    providers: [CategoryIconPipe],
})
export class AnalyticsComponent implements OnInit {
  monthlyData: MonthlyData[] = [];
  categoryData: CategorySlice[] = [];
  combinedChartOptions: any;
  pieChartOptions: any;
  balance: number = 0;
  highestTransaction: Transaction | null = null;
  private categoryIconPipe = inject(CategoryIconPipe);

  // Date filters
  startDate: string = '';
  endDate: string = '';

  constructor(private dbService: IndexedDBService) {
    // Set default date range (current month)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(1); // First day of current month

    this.endDate = endDate.toISOString().split('T')[0];
    this.startDate = startDate.toISOString().split('T')[0];
  }

  async ngOnInit() {
    await this.loadData();
    this.initializeCharts();
  }

  async onDateFilterChange() {
    await this.loadData();
    this.initializeCharts();
  }

  private async loadData() {
    await this.loadMonthlyData();
    await this.loadCategoryData();
  }

  private async loadMonthlyData() {
    try {
      const transactions = await this.dbService.getAllTransactions();
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);

      // Filter transactions by date range
      const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      // Calculate balance (total income - total expenses)
      this.balance = filteredTransactions.reduce((total, transaction) => {
        return transaction.type === 'income'
          ? total + transaction.amount
          : total - transaction.amount;
      }, 0);

      // Find highest expense transaction
      const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
      this.highestTransaction = expenseTransactions.length > 0
        ? expenseTransactions.reduce((highest, current) =>
            current.amount > highest.amount ? current : highest
          )
        : null;

      // Process data by month
      const dataByMonth = new Map<string, { expenses: number; income: number }>();

      filteredTransactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        const currentData = dataByMonth.get(monthKey) || { expenses: 0, income: 0 };

        if (transaction.type === 'expense') {
          currentData.expenses += transaction.amount;
        } else if (transaction.type === 'income') {
          currentData.income += transaction.amount;
        }

        dataByMonth.set(monthKey, currentData);
      });

      // Convert to array and sort by date
      this.monthlyData = Array.from(dataByMonth.entries())
        .map(([monthKey, data]) => {
          const [year, month] = monthKey.split('-');
          const date = new Date(parseInt(year), parseInt(month) - 1);
          return {
            month: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
            expenses: data.expenses,
            income: data.income
          };
        })
        .sort((a, b) => {
          const dateA = new Date(a.month + ' 1');
          const dateB = new Date(b.month + ' 1');
          return dateA.getTime() - dateB.getTime();
        });

    } catch (error) {
      console.error('Error loading monthly data:', error);
    }
  }

  private async loadCategoryData() {
    try {
      const transactions = await this.dbService.getAllTransactions();
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);

      // Filter transactions by date range and type (only expenses for pie chart)
      const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate && transaction.type === 'expense';
      });

      // Group by category
      const dataByCategory = new Map<string, { amount: number; icon: string; iconSymbol: string }>();

      filteredTransactions.forEach(transaction => {
        const categoryName = transaction.category.name;
        const existingData = dataByCategory.get(categoryName);

        if (existingData) {
          existingData.amount += transaction.amount;
        } else {
          dataByCategory.set(categoryName, {
            amount: transaction.amount,
            icon: transaction.category.icon,
            iconSymbol: this.categoryIconPipe.transform(transaction.category.icon),
          });
        }
      });

      const totalCategoryAmount = Array.from(dataByCategory.values()).reduce((sum, data) => sum + data.amount, 0);

      // Convert to array
      this.categoryData = Array.from(dataByCategory.entries())
        .map(([category, data]) => ({
          category,
          amount: data.amount,
          icon: data.icon,
          iconSymbol: data.iconSymbol,
          percentage: totalCategoryAmount === 0 ? 0 : (data.amount / totalCategoryAmount) * 100,
        }))
        .sort((a, b) => b.amount - a.amount); // Sort by amount descending

    } catch (error) {
      console.error('Error loading category data:', error);
    }
  }

  private initializeCharts() {
    // Combined bar chart with expenses and income
    this.combinedChartOptions = {
      data: this.monthlyData,
      background: {
        fill: 'transparent',
      },
      series: [
        {
          type: 'bar',
          xKey: 'month',
          yKey: 'expenses',
          yName: 'Expenses (€)',
          fill: '#dc2626', // dark red
          stroke: '#b91c1c',
        },
        {
          type: 'bar',
          xKey: 'month',
          yKey: 'income',
          yName: 'Income (€)',
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
      legend: {
        position: 'top',
        item: {
          label: {
            color: '#e2e8f0',
          },
        },
      },
    };

    // Pie chart for spending by category
    this.pieChartOptions = {
      data: this.categoryData,
      background: {
        fill: 'transparent',
      },
      series: [
        {
          type: 'pie',
          angleKey: 'amount',
          labelKey: 'category',
          calloutLabelKey: 'category',
          calloutLabel: {
            enabled: true,
            color: '#e2e8f0',
            fontSize: 12,
            formatter: ({ datum }: { datum: CategorySlice }) => {
              const percentage = datum.percentage.toFixed(1);
              return `${datum.iconSymbol} ${datum.category} · ${percentage}%`;
            },
          },
          sectorLabelKey: 'iconSymbol',
          sectorLabel: {
            enabled: true,
            color: '#ffffff',
            fontSize: 10,
            formatter: ({ datum }: { datum: CategorySlice }) => datum.iconSymbol,
          },
          tooltip: {
            renderer: ({ datum }: { datum: CategorySlice }) => ({
              title: datum.category,
              content: `€${datum.amount.toFixed(2)} (${datum.percentage.toFixed(1)}%)`,
            }),
          },
        },
      ],
      legend: {
        position: 'right',
        item: {
          label: {
            color: '#e2e8f0',
          },
        },
      },
    };
  }
}
