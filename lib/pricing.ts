export function calculateTotalPrice(basePrice: number, people: number, dateValue: string | Date) {
  const subtotal = basePrice * people;
  const date = new Date(dateValue);
  const isWeekend = [0, 6].includes(date.getDay());
  const weekendSurcharge = isWeekend ? Math.round(subtotal * 0.12) : 0;
  const groupDiscount = people >= 5 ? Math.round(subtotal * 0.08) : 0;
  const serviceFee = Math.round(subtotal * 0.05);
  const totalPrice = subtotal + weekendSurcharge + serviceFee - groupDiscount;

  return {
    subtotal,
    weekendSurcharge,
    groupDiscount,
    serviceFee,
    totalPrice
  };
}
