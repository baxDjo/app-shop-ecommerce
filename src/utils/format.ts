export const money = (cents: number) =>
  (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "CAN" });
