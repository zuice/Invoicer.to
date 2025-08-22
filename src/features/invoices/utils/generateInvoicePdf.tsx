import puppeteer from "puppeteer";
import { renderToString } from "react-dom/server";
import { InvoiceRaw } from "@/features/invoices/components/InvoiceRaw";

import styles from "@/styles/app.css?inline";
import { invoices, lineItems } from "@/lib/db/schema";

type InvoiceWithItems = typeof invoices.$inferSelect & {
  items: (typeof lineItems.$inferSelect)[];
};

export async function generateInvoicePdf(invoice: InvoiceWithItems) {
  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>${styles}</style>
      </head>
      <body class="flex flex-1 flex-col gap-4 bg-white p-8">
        ${renderToString(<InvoiceRaw invoice={invoice} />)}
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return pdf;
}
