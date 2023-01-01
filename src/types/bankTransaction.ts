type BankTransaction = {
    date: string;
    dateYear: number;
    dateMonth: number;
    dateDay: number;
    time: string;
    type: string;
    name: string;
    // emoji here
    category: string;
    amount: number;
    currency: string;
    localAmount: number;
    localCurrency: string; // Actually the foreign currency
};
