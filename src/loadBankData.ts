import { transactions } from "./bankData";

export default function loadBankData(data: Array<any>):void {
    // Set bankData array to be whatever this new data is
    for (let index = 0; index < data.length; index++) {
        const dateParts: Array<string> = data[index][0].split("/");
        const date: Date = new Date(Number(dateParts[2]), Number(dateParts[1])-1, Number(dateParts[0])); // JS months are zero-indexed
        const year: number = date.getFullYear();
        const month: number = date.getMonth();
        const day: number = date.getDay();

        const transaction: BankTransaction = {
            date: data[index][0],
            dateYear: year,
            dateMonth: month + 1, // JS months are zero-indexed
            dateDay: day,
            time: data[index][1],
            type: data[index][2],
            name: data[index][3],
            category: data[index][5],
            amount: Number(data[index][6]) * -1, // Invert money out being negative and money in being positive
            currency: data[index][7],
            localAmount: Number(data[index][8]) * -1, // Invert money out being negative and money in being positive
            localCurrency: data[index][9],
        };
        
        transactions.push(transaction);
    }
}