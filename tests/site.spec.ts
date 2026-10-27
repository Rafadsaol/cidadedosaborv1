import { test, expect } from "@playwright/test";

test("todas as páginas carregam, sem erros e sem rolagem horizontal", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of [
    "/",
    "/cardapio",
    "/delivery",
    "/carrinho",
    "/reservas",
    "/sobre",
    "/contato",
    "/login",
    "/cadastro",
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
    await expect(page.getByRole("main")).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("busca sem acentos, filtros e estado vazio", async ({ page }) => {
  await page.goto("/cardapio");
  await expect(page.locator(".product-card")).toHaveCount(12);
  await page.getByRole("button", { name: "Bebidas", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Todos", exact: true }).click();
  await page.getByLabel("Buscar pelo nome").fill("duplo");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.getByLabel("Buscar pelo nome").fill("NAO EXISTE");
  await expect(page.getByText("Nenhum sabor por aqui… ainda.")).toBeVisible();
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.locator(".product-card")).toHaveCount(12);
});

test("modal, carrinho, quantidades, persistência e remoção", async ({
  page,
}) => {
  await page.goto("/cardapio");
  await page
    .getByRole("button", {
      name: "Ver detalhes de Cidade Original",
      exact: true,
    })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("dialog").getByText("Blend bovino 160g", { exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page
    .getByRole("button", {
      name: "Adicionar Cidade Original ao carrinho",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("link", { name: "Carrinho, 1 itens" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Ver carrinho →", exact: true }).click();
  await expect(page.locator(".summary-total")).toContainText("29,90");
  await page
    .getByRole("button", { name: "Aumentar quantidade de Cidade Original" })
    .click();
  await expect(page.locator(".summary-total")).toContainText("59,80");
  await page.reload();
  await expect(
    page.getByLabel("Quantidade de Cidade Original", { exact: true }),
  ).toHaveText("2");
  await page
    .getByRole("button", { name: "Diminuir quantidade de Cidade Original" })
    .click();
  await expect(page.locator(".summary-total")).toContainText("29,90");
  await page.getByRole("button", { name: "Remover Cidade Original" }).click();
  await expect(
    page.getByText("Seu carrinho ainda está vazio.", { exact: false }),
  ).toBeVisible();
});

test("carrinho recupera armazenamento inválido", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("cidade-do-sabor:cart:v1", "{invalid"),
  );
  await page.goto("/carrinho");
  await expect(
    page.getByText("Seu carrinho ainda está vazio.", { exact: false }),
  ).toBeVisible();
});

test("reserva valida telefone e confirma somente simulação", async ({
  page,
}) => {
  await page.goto("/reservas");
  await page.getByLabel("Seu nome").fill("Visitante Teste");
  await page.getByLabel("Telefone com DDD").fill("123");
  const date = new Date();
  date.setDate(date.getDate() + 2);
  const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  await page.getByLabel("Data", { exact: true }).fill(value);
  await page.getByLabel("Horário", { exact: true }).selectOption("19:00");
  await page.getByRole("button", { name: "Simular reserva" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "telefone com DDD",
  );
  await page.getByLabel("Telefone com DDD").fill("11999999999");
  await page.getByRole("button", { name: "Simular reserva" }).click();
  await expect(
    page.getByText("Simulação concluída! Nenhuma reserva real foi realizada."),
  ).toBeVisible();
});

test("contato valida formulário sem enviar mensagens", async ({ page }) => {
  await page.goto("/contato");
  await page.getByRole("button", { name: "Simular envio" }).click();
  await expect(page.locator("input:invalid").first()).toBeVisible();
  await page.getByLabel("Seu nome").fill("Visitante Teste");
  await page.getByLabel("E-mail", { exact: true }).fill("teste@example.com");
  await page.getByLabel("Assunto").selectOption("Sugestões");
  await page
    .getByLabel("Sua mensagem")
    .fill("Mensagem fictícia para testar a interface.");
  await page.getByRole("button", { name: "Simular envio" }).click();
  await expect(
    page.getByText("Formulário validado! Nenhuma mensagem foi enviada."),
  ).toBeVisible();
  await expect(page.getByText("WhatsApp ainda não configurado")).toBeVisible();
});

test("cadastro verifica confirmação e não guarda senha", async ({ page }) => {
  await page.goto("/cadastro");
  await page.getByLabel("Seu nome").fill("Visitante Teste");
  await page.getByLabel("E-mail", { exact: true }).fill("teste@example.com");
  await page.locator('[name="password"]').fill("SenhaTeste123");
  await page.getByLabel("Confirme a senha").fill("OutraSenha123");
  await page.getByRole("button", { name: "Simular cadastro" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "senhas precisam ser iguais",
  );
  await page.getByLabel("Confirme a senha").fill("SenhaTeste123");
  await page.getByRole("button", { name: "Simular cadastro" }).click();
  await expect(
    page.getByText("Nenhuma conta foi criada", { exact: false }),
  ).toBeVisible();
  await expect(page.locator('[name="password"]')).toHaveValue("");
  expect(
    await page.evaluate(() =>
      JSON.stringify({
        local: { ...localStorage },
        session: { ...sessionStorage },
      }),
    ),
  ).not.toContain("SenhaTeste123");
});

test("login informa que não cria sessão", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail", { exact: true }).fill("teste@example.com");
  await page.locator('[name="password"]').fill("SenhaTeste123");
  await page.getByRole("button", { name: "Visualizar acesso" }).click();
  await expect(
    page.getByText("Nenhuma sessão foi iniciada", { exact: false }),
  ).toBeVisible();
});

test("navegação por menu funciona em desktop e mobile", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await expect(
    page.getByRole("dialog", { name: "EXPLORE A CIDADE" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Navegação principal", exact: true })
    .getByRole("link", { name: "Cardápio" })
    .click();
  await expect(page).toHaveURL(/cardapio/);
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("imagens locais carregam e fallback funciona", async ({ page }) => {
  await page.goto("/cardapio");
  const first = page.locator(".product-photo img").first();
  await expect(first).toBeVisible();
  await expect
    .poll(() =>
      first.evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      ),
    )
    .toBeTruthy();
  await first.evaluate((image) => image.dispatchEvent(new Event("error")));
  await expect(first).toHaveAttribute("src", /food-fallback/);
});

test("todos os arquivos de imagem existem", async ({ request }) => {
  for (const name of [
    "hero",
    "exploded-burger",
    "burger",
    "bacon",
    "double",
    "veggie",
    "about",
    "combo",
    "fries",
    "drink",
    "lemonade",
    "brownie",
    "shake",
  ]) {
    const response = await request.get(`/images/${name}.webp`);
    expect(response.status(), name).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/webp");
  }
});

test("acessibilidade automática das nove páginas", async ({ page }) => {
  test.setTimeout(60000);
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  for (const route of [
    "/",
    "/cardapio",
    "/delivery",
    "/carrinho",
    "/reservas",
    "/sobre",
    "/contato",
    "/login",
    "/cadastro",
  ]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations,
      `${route}: ${JSON.stringify(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
  }
});

test("vitrine troca produtos e adiciona o produto selecionado", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Destacar Duplo da Cidade" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Próximo hambúrguer" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Bacon de sobra.",
  );
  await page.getByRole("button", { name: "Pedir agora" }).click();
  await page.getByRole("link", { name: "Ver carrinho →" }).click();
  await expect(page.locator(".cart-item")).toContainText("Bacon Boulevard");
  await expect(page.locator(".summary-total")).toContainText("34,90");
  await page.goto("/");
  await page.getByRole("button", { name: "Hambúrguer anterior" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Feito de plantas.",
  );
  await page.getByRole("button", { name: "Destaque 1", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "domina a cidade.",
  );
});

test("cabeçalho permite fechar menu com Escape e acessar busca", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();
  await page.getByRole("link", { name: "Buscar no cardápio" }).click();
  await expect(page).toHaveURL(/cardapio#product-search/);
  await page.getByLabel("Buscar pelo nome").fill("Bacon");
  await expect(page.locator(".product-card")).toHaveCount(2);
});
