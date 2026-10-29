import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const baseURL = process.env.CASE_STUDY_BASE_URL || "http://127.0.0.1:3000";
const output = fileURLToPath(new URL("../public/images/case-study/", import.meta.url));
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
const browser = await chromium.launch({ executablePath, args: ["--no-sandbox"] });
await mkdir(output, { recursive: true });

// Contextos isolados: somente exemplos e dados fictícios criados pelo script.
const desktop = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
  timezoneId: "America/Sao_Paulo",
});
const page = await desktop.newPage();
async function ready(target) {
  await target.waitForLoadState("networkidle");
  await target.evaluate(() => document.fonts.ready);
  await target.locator("img").evaluateAll(async (images) => {
    await Promise.all(images.filter(image => {
      const rect = image.getBoundingClientRect();
      return rect.width && rect.height && rect.top < innerHeight && rect.bottom > 0;
    }).map(image => image.decode().catch(() => {})));
  });
}
async function capture(target, name, locator) {
  await ready(target);
  const buffer = locator
    ? await locator.screenshot({ animations: "disabled" })
    : await target.screenshot({ animations: "disabled" });
  const path = `${output}/${name}.webp`;
  await sharp(buffer).webp({ quality: 88, effort: 5 }).toFile(path);
  console.log(`Captura real: ${name}.webp`);
}
try {
  await page.goto(`${baseURL}/`);
  await page.getByRole("button", { name: /Pedir agora/ }).waitFor({ state: "visible" });
  await capture(page, "inicio-desktop");
  await page.goto(`${baseURL}/cardapio`);
  await page.locator(".product-card").first().waitFor();
  await capture(page, "cardapio-desktop");
  await page.getByRole("button", { name: "Ver detalhes de Cidade Original", exact: true }).click();
  await page.getByRole("dialog").getByLabel(/Bacon extra/).check();
  await capture(page, "personalizacao-desktop");
  await page.getByRole("dialog").getByRole("button", { name: "Adicionar ao carrinho", exact: true }).click();
  await page.goto(`${baseURL}/checkout`);
  await page.getByLabel("Nome", { exact: true }).fill("Cliente Teste");
  await capture(page, "checkout-desktop");
  await page.goto(`${baseURL}/login`);
  await page.getByRole("button", { name: /Administrador Demo/ }).click();
  await page.getByRole("heading", { level: 1, name: "Sua operação, em um olhar." }).waitFor();
  // Fecha apenas o toast de troca de perfil para não cobrir os gráficos.
  const toastClose = page.getByRole("button", { name: "Fechar aviso", exact: true });
  if (await toastClose.isVisible()) await toastClose.click();
  await capture(page, "painel-desktop");
  await page.goto(`${baseURL}/admin/pedidos`);
  await page.locator(".admin-order").first().waitFor();
  await capture(page, "pedidos-desktop");

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 1000 }, deviceScaleFactor: 2,
    isMobile: true, hasTouch: true, timezoneId: "America/Sao_Paulo",
  });
  const phone = await mobile.newPage();
  await phone.goto(`${baseURL}/`);
  await phone.getByRole("button", { name: /Pedir agora/ }).waitFor({ state: "visible" });
  await capture(phone, "inicio-mobile");
  await phone.locator("#favoritos").scrollIntoViewIfNeeded();
  await capture(phone, "favoritos-mobile", phone.locator("#favoritos"));
  await mobile.close();
} finally {
  await desktop.close();
  await browser.close();
}
