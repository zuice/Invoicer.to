import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import puppeteer from "puppeteer";
import { renderToString } from "react-dom/server";

import { invoices, lineItems } from "@/lib/db/schema";
import { InvoiceRaw } from "@/features/invoices/components/InvoiceRaw";

type InvoiceWithItems = typeof invoices.$inferSelect & {
  items: (typeof lineItems.$inferSelect)[];
};

let cachedCss: string | null = null;

async function compileTailwind() {
  if (cachedCss) return cachedCss;

  const cssPath = path.resolve("./src/styles/app.css");
  const inputCss = fs.readFileSync(cssPath, "utf8");

  const result = await postcss([tailwindcss, autoprefixer]).process(inputCss, {
    from: cssPath,
  });

  cachedCss = result.css;
  return cachedCss;
}

export async function generateInvoicePdf(invoice: InvoiceWithItems) {
  const styles = await compileTailwind();

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
