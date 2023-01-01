type ChartData = {
    labels: string[];
    datasets: {
      label: string;
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      data: number[];
    }[];
};