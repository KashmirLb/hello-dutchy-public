export default function createOrderId(): string {
    const newDate = new Date(Date.now())

    const options: Intl.DateTimeFormatOptions  = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    }

    const dateString = newDate.toLocaleDateString('en-EN', options)

    let day = dateString.split("/")[1] ?? "00"
    let month = dateString.split("/")[0] ?? "00"
    let year = dateString.split("/")[2] ?? "0000"

    if(day && day.length == 1){
        day = "0" + day
    }
    if(month && month.length == 1){
        month = "0" + month
    }
    if(year && year.length == 4){
        year = year.slice(2)
    }

    return day+month+year + "-" + Math.random().toString(36).substring(2, 15).toUpperCase() + "-" + Math.floor(Math.random() * 9999)
}