import { OrderItemSummary } from "~/types"
import formatPrices from "./formatPrices"

export default function convertItemsToTable(items: OrderItemSummary[]): string {
    const table = items.map((item, index) => {
        return `
            <tr style="background-color: ${index % 2 == 0 ? "" : "#ffffff"};">
                <td style="max-width:200px; color: #1b265c;">${item.productName}
                    ${item.color != "" ? ` (${item.color})` : ""}
                    ${item.size != "" ? ` (${item.size})` : ""}
                </td>
                <td style="color: #1b265c;">${item.quantity}</td>
                <td style="color: #1b265c;">${formatPrices(Number.parseFloat(item.price))}</td>
            </tr>
        `
    })
    return table.join("")
}