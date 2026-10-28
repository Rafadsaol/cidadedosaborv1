import { test, expect } from "@playwright/test";

test("movimento reduzido pode ser substituído por escolha explícita no destaque", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const enable = page.getByRole("button", { name: "Ativar animação", exact: true });
  await expect(enable).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Próximo hambúrguer" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Bacon de sobra.");
  expect(await page.evaluate(() => document.getAnimations().some(a => a.playState === "running"))).toBe(false);

  await enable.click();
  await expect(page.getByRole("button", { name: "Reduzir movimento", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Próximo hambúrguer" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Feito de plantas.");
  await expect.poll(() => page.evaluate(() => document.getAnimations().some(a => a.playState === "running"))).toBe(true);

  await page.reload();
  const reduce = page.getByRole("button", { name: "Reduzir movimento", exact: true });
  await expect(reduce).toHaveAttribute("aria-pressed", "true");
  await reduce.click();
  await page.getByRole("button", { name: "Próximo hambúrguer" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Bacon de sobra.");
  expect(await page.evaluate(() => document.getAnimations().some(a => a.playState === "running"))).toBe(false);
});
