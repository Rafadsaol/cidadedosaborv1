import { test, expect, type Page } from "@playwright/test";
async function openProduct(page: Page, name: string) {
  await page.goto("/cardapio");
  await page
    .getByRole("button", { name: `Ver detalhes de ${name}`, exact: true })
    .click();
  return page.getByRole("dialog", { name, exact: true });
}
async function addOriginal(page: Page) {
  const dialog = await openProduct(page, "Cidade Original");
  await dialog
    .getByRole("button", { name: "Adicionar ao carrinho", exact: true })
    .click();
}

test("personalização calcula total, agrupa iguais e separa diferentes", async ({
  page,
}) => {
  for (let i = 0; i < 2; i++) {
    const dialog = await openProduct(page, "Cidade Original");
    await dialog.getByLabel("Sem Tomate", { exact: true }).check();
    await dialog.getByLabel(/Bacon extra/).check();
    await dialog.getByLabel(/Cheddar extra/).check();
    await dialog.getByLabel("Bem passado", { exact: true }).check();
    await dialog
      .getByRole("textbox", { name: /Observações/ })
      .fill("Separar molho");
    await dialog
      .getByRole("button", { name: "Aumentar quantidade de Cidade Original" })
      .click();
    await expect(dialog.locator(".customizer-total")).toContainText("77,80");
    await dialog
      .getByRole("button", { name: "Adicionar ao carrinho", exact: true })
      .click();
  }
  const dialog = await openProduct(page, "Cidade Original");
  await dialog.getByLabel(/Cheddar extra/).check();
  await dialog
    .getByRole("button", { name: "Adicionar ao carrinho", exact: true })
    .click();
  await page.goto("/carrinho");
  await expect(page.locator(".cart-item")).toHaveCount(2);
  await expect(page.locator(".summary-total")).toContainText("189,50");
  await expect(page.locator(".cart-item").first()).toContainText("Sem: Tomate");
  await expect(page.locator(".cart-item").first()).toContainText(
    "Separar molho",
  );
  await expect(
    page.getByRole("link", { name: "Carrinho, 5 itens" }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator(".summary-total")).toContainText("189,50");
});

test("combo tem escolhas, acréscimos e bloqueios compatíveis", async ({
  page,
}) => {
  const dialog = await openProduct(page, "Combo da Cidade");
  await dialog.getByLabel(/Duplo da Cidade/).check();
  await dialog.getByLabel(/Fritas cheddar e bacon/).check();
  await dialog.getByLabel(/Limonada da Casa/).check();
  await dialog.getByLabel(/Cheddar extra/).check();
  await expect(dialog.getByLabel(/Fritas rústicas/)).toBeDisabled();
  await expect(dialog.getByLabel(/Cebola crispy/)).toBeDisabled();
  await expect(dialog.locator(".customizer-total")).toContainText("71,90");
  await dialog.getByLabel(/Jardim Veggie/).check();
  await expect(dialog.getByLabel(/Bacon extra/)).toBeDisabled();
  await dialog.getByLabel(/Duplo da Cidade/).check();
  await dialog
    .getByRole("button", { name: "Adicionar ao carrinho", exact: true })
    .click();
  await page.goto("/carrinho");
  await expect(page.locator(".cart-item")).toContainText("Limonada da Casa");
  await expect(page.locator(".summary-total")).toContainText("71,90");
});

test("filtros, ordenação e histórico preservam seleção", async ({ page }) => {
  await page.goto("/cardapio?categoria=Bebidas&ordem=price-desc");
  await expect(
    page.getByRole("button", { name: "Bebidas", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".product-title h3").first()).toHaveText(
    "Limonada da Casa",
  );
  await page
    .getByRole("combobox", { name: "Ordenar por", exact: true })
    .selectOption("price-asc");
  await expect(page.locator(".product-title h3").first()).toHaveText(
    "Refrigerante 350ml",
  );
  await page.getByRole("button", { name: "Sobremesas", exact: true }).click();
  await expect(page).toHaveURL(/categoria=Sobremesas/);
  await page.goBack();
  await expect(
    page.getByRole("button", { name: "Bebidas", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.locator(".product-card")).toHaveCount(2);
});

test("confirmação protege limpeza e alterações sincronizam entre abas", async ({
  page,
  context,
}) => {
  await addOriginal(page);
  await page.goto("/carrinho");
  const other = await context.newPage();
  await other.goto("/carrinho");
  await expect(other.locator(".cart-item")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Aumentar quantidade de Cidade Original" })
    .click();
  await expect(other.locator(".summary-total")).toContainText("59,80");
  await page
    .getByRole("button", { name: "Esvaziar carrinho", exact: true })
    .click();
  await page.getByRole("button", { name: "Manter carrinho" }).click();
  await expect(page.locator(".cart-item")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Esvaziar carrinho", exact: true })
    .click();
  await page.getByRole("button", { name: "Sim, esvaziar" }).click();
  await expect(
    page.getByText("Seu carrinho ainda está vazio.", { exact: false }),
  ).toBeVisible();
  await expect(
    other.getByText("Seu carrinho ainda está vazio.", { exact: false }),
  ).toBeVisible();
  await other.close();
});

test("checkout valida delivery, simula pagamento sem campos financeiros", async ({
  page,
}) => {
  await addOriginal(page);
  await page.goto("/checkout");
  await page.getByRole("button", { name: "Simular pedido" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Revise" }),
  ).toBeVisible();
  const form = page.locator("form:visible");
  await form.getByLabel("Nome", { exact: true }).fill("Cliente Fictício");
  await form.getByLabel("Telefone", { exact: true }).fill("11999999999");
  await form.getByLabel("CEP", { exact: true }).fill("01001-000");
  await form.getByLabel("Rua", { exact: true }).fill("Rua Fictícia");
  await form.getByLabel("Número", { exact: true }).fill("123");
  await form.getByLabel("Bairro", { exact: true }).fill("Centro");
  await form.getByLabel("Cidade", { exact: true }).fill("São Paulo");
  await form.getByLabel("Estado", { exact: true }).selectOption("SP");
  await form.getByLabel("Cartão de crédito", { exact: true }).check();
  await expect(
    form.locator('input[name*="card"], input[type="password"]'),
  ).toHaveCount(0);
  await expect(page.locator(".summary-total")).toContainText("35,90");
  await page.getByRole("button", { name: "Simular pedido" }).click();
  await expect(
    page.getByText("Nenhum pedido foi enviado ao restaurante.", {
      exact: true,
    }),
  ).toBeVisible();
  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }));
  expect(stored).not.toContain("Cliente Fictício");
  expect(stored).not.toContain("11999999999");
});

test("retirada dispensa endereço e frete, checkout vazio é tratado", async ({
  page,
}) => {
  await page.goto("/checkout");
  await expect(
    page.getByText("Seu carrinho precisa de um sabor."),
  ).toBeVisible();
  await addOriginal(page);
  await page.goto("/checkout");
  const form = page.locator("form:visible");
  await form.getByLabel(/Retirada no balcão/).check();
  await expect(form.getByLabel("CEP", { exact: true })).toHaveCount(0);
  await form.getByLabel("Nome", { exact: true }).fill("Cliente Fictício");
  await form.getByLabel("Telefone", { exact: true }).fill("11999999999");
  await expect(page.locator(".summary-total")).toContainText("29,90");
  await page.getByRole("button", { name: "Simular pedido" }).click();
  await expect(
    page.getByText("Nenhum pedido foi enviado ao restaurante.", {
      exact: true,
    }),
  ).toBeVisible();
});

test("checkout preenchido e personalização não têm violações automáticas", async ({
  page,
}) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  await openProduct(page, "Cidade Original");
  let results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Adicionar ao carrinho", exact: true })
    .click();
  await page.goto("/checkout");
  results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
