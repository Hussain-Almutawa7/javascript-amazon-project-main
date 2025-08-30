export const deliveryOptions = [{
    id: "1",
    deliveryDays: 7,
    priceCents: 0
}, {
    id: "2",
    deliveryDays: 3,
    priceCents: 499
}, {
    id: "3",
    deliveryDays: 1,
    priceCents: 999
}];


export function calculateDeliveryDate(daysToAdd, startDate) {
    let date = startDate;
    let remaining = Number(daysToAdd);

    while (remaining > 0) {
        date = date.add(1, "day")

        if (date.day() !== 0 && date.day() !== 6) {
            remaining--;
        }
    }

    return date;
}