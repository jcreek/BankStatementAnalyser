import { transactions } from "./bankData";
import Chart from 'chart.js/auto';

export default function generateCharts(): void {
    // const filter: Filter = { year: 2022, category: 'Eating out', excludeIncome: true};
    const filter: Filter = { year: 2022, excludeIncome: true};
    // const filter: Filter = { year: 2022, month: 1, excludeIncome: true};
    const chartData = getChartData(transactions, filter);
    console.log('chartData', chartData);

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          scales: {
            x: {
                stacked: true,
            },
            y: {
              stacked: true
            }
          }
        }
      });
}

function getRandomColor(): string {
  // Generate a random color in hexadecimal format
  const color = Math.floor(Math.random() * 0x1000000).toString(16);
  return '#' + ('000000' + color).slice(-6);
}

function getChartData(transactions: BankTransaction[], filters: { year?: number, month?: number, category?: string, excludeIncome?: boolean } | null | undefined): ChartData {  
  // Return an empty chart data object if no filters are provided
  if (!filters) {
    return {
      labels: [],
      datasets: []
    };
  }
  
  // Filter the transactions based on the specified filters
  const filteredTransactions = transactions.filter(transaction => {
    if (filters.year && transaction.dateYear !== filters.year) {
      return false;
    }
    if (filters.month && transaction.dateMonth !== filters.month) {
      return false;
    }
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }
    return true;
  });

  // Group the transactions by year or month, depending on the filters
  const groupedTransactions: { [key: string]: BankTransaction[] } = {};
  if (filters.year && !filters.month) {
    // Group the transactions by month
    for (const transaction of filteredTransactions) {
      if (filters.excludeIncome && transaction.amount < 0) {
        continue;  // Skip transactions with a positive amount if excludeIncome is true
      }
      const month = `${transaction.dateYear}-${transaction.dateMonth}`;
      if (!groupedTransactions[month]) {
        groupedTransactions[month] = [];
      }
      groupedTransactions[month].push(transaction);
    }
  } else {
    // Group the transactions by year
    for (const transaction of filteredTransactions) {
      if (filters.excludeIncome && transaction.amount < 0) {
        continue;  // Skip transactions with a positive amount if excludeIncome is true
      }
      const year = transaction.dateYear.toString();
      if (!groupedTransactions[year]) {
        groupedTransactions[year] = [];
      }
      groupedTransactions[year].push(transaction);
    }
  }

  // Create the chart data object
  const chartData: ChartData = {
    labels: [],
    datasets: []
  };

  // Add a dataset for each category
  const categories: { [key: string]: string } = {};
  for (const year in groupedTransactions) {
    for (let index = 0; index < groupedTransactions[year].length; index++) {
      const transaction = groupedTransactions[year][index];
      if (!categories[transaction.category]) {
        categories[transaction.category] = getRandomColor();
        chartData.datasets.push({
          label: transaction.category,
          data: [],
          backgroundColor: categories[transaction.category]
        });
      }
    }
    console.log('here');
  
    // Populate the chart data with the transaction amounts
    for (const year in groupedTransactions) {
      chartData.labels.push(year);
      for (let i = 0; i < chartData.datasets.length; i++) {
        chartData.datasets[i].data.push(0);
      }
      for (const transaction of groupedTransactions[year]) {
        for (let i = 0; i < chartData.datasets.length; i++) {
          if (chartData.datasets[i].label === transaction.category) {
            chartData.datasets[i].data[chartData.labels.length - 1] += transaction.amount;
            break;
          }
        }
      }
    }


  
    return chartData;
  }
}
  
