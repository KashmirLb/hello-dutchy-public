export default function formatPrices(price: number): string {
    return price.toLocaleString('en-EN', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function formatPricesPayment(price: number): string {
    return price.toLocaleString('en-EN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}