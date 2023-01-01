import { transactions } from "./bankData";
import Chart from 'chart.js/auto';
import * as chroma from 'chroma-js';

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

  // Generate a color scale using the chroma-js library, with the number of colors equal to the number of categories
  const categories = new Set<string>();
  for (const transaction of transactions) {
    categories.add(transaction.category);
  }
  const colorScale = chroma.scale('Spectral').mode('hsl').colors(categories.size);
  
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
  let i = 0;
  categories.forEach((category: string) => {
    chartData.datasets.push({
      label: category,
      data: [],
      backgroundColor: colorScale[i % colorScale.length],  // Use a color from the color scale,
      borderColor: 'black',
      borderWidth: 2
    });
    i++;
  });

  // Populate the chart data with the transaction amounts
  for (const key of Object.keys(groupedTransactions)) {
    chartData.labels.push(key);
    const transactions = groupedTransactions[key];
    for (let i = 0; i < chartData.datasets.length; i++) {
      chartData.datasets[i].data.push(0);
      for (const transaction of transactions) {
        if (transaction.category === chartData.datasets[i].label) {
          chartData.datasets[i].data[chartData.labels.length - 1] += transaction.amount;
        }
      }
    }
  }

  return chartData;
}
  
