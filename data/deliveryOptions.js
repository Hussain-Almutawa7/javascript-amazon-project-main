export const deliveryOptions = [
  {
    id: "1",
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    id: "2",
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    id: "3",
    deliveryDays: 1,
    priceCents: 999,
  },
];

export function calculateDeliveryDate(daysToAdd, startDate) {
  if (!startDate || !startDate.isValid || !startDate.isValid()) {
    throw new Error("calculateDeliveryDate: invalid startDate");
  }

  let date = startDate.startOf("day");
  let remaining = Number(daysToAdd);

  while (remaining > 0) {
    date = date.add(1, "day");
    date = checkHoliday(date);
    remaining--;
  }
  return date;
}

export function checkHoliday(dateCheck) {
  if (!dateCheck || !dateCheck.isValid || !dateCheck.isValid()) {
    throw new Error("checkHoliday: invalid dateCheck");
  }
  let d = dateCheck.startOf("day");

  while (true) {
    const dow = d.day();
    if (dow === 0 || dow === 6) {
      d = d.add(1, "day");
      continue;
    }

    const formatted = d.format("MM-DD");
    const holidays = ["01-01"];
    if (holidays.includes(formatted)) {
      d = d.add(1, "day");
      continue;
    }

    return d;
  }
}
