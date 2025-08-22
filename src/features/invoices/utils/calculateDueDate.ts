import { addDays, lastDayOfMonth } from "date-fns";

import { PAYMENT_TERMS } from "@/features/invoices/constants";

type PaymentTerm = (typeof PAYMENT_TERMS)[number];

export function calculateDueDate(
  startDate: Date,
  term: PaymentTerm,
  customDays?: number,
): Date {
  switch (term) {
    case "DUE_ON_RECEIPT":
      return startDate;

    case "NET_7":
      return addDays(startDate, 7);

    case "NET_15":
      return addDays(startDate, 15);

    case "NET_30":
      return addDays(startDate, 30);

    case "NET_45":
      return addDays(startDate, 45);

    case "NET_60":
      return addDays(startDate, 60);

    case "EOM":
      return lastDayOfMonth(startDate);

    case "CUSTOM":
      if (typeof customDays !== "number") {
        throw new Error(
          "CUSTOM term requires a number of days (customDays argument).",
        );
      }
      return addDays(startDate, customDays);

    default:
      throw new Error(`Unsupported payment term: ${term}`);
  }
}
