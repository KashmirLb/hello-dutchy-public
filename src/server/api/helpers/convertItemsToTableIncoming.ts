import { OrderItemSummary } from "~/types"

export default function convertItemsToTableIncoming(items: OrderItemSummary[]): string {
    const table = items.map((item, index) => {
        return `
            <tr style="border-bottom: 1px solid #304e93; background-color: ${index % 2 == 0 ? "transparent" : "#ffffff"};">
                <td style="max-width:200px; color: #1b265c; min-height: 50px;">${item.productCode}</td>
                <td style="max-width:200px; color: #1b265c; min-height: 50px;">${item.productName}</td>
                <td style="color: #1b265c;">${item.color}</td>
                <td style="color: #1b265c;">${item.size}</td>
                <td style="color: #1b265c;">${item.quantity}</td>
            </tr>
        `
    })
    return table.join("")
}