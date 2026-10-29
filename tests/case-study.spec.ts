import { test, expect } from "@playwright/test";

test("case study apresenta o projeto, navega por seções e amplia capturas reais", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const response = await page.goto("/case-study");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Case study — Cidade do Sabor/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cidadedo Sabor.");
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(8);
  await expect(page.getByText("Não há backend, cobrança, envio ao restaurante", { exact: false })).toBeVisible();

  const navigation = page.getByRole("navigation", { name: "Seções do case study" });
  for (const id of ["visao-geral", "identidade", "telas", "recursos", "tecnologias", "experiencia", "demonstracao"]) {
    const link = navigation.locator(`a[href="#${id}"]`);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }

  const destinations = await page.locator('main a[href^="/"]').evaluateAll(links =>
    [...new Set(links.map(link => link.getAttribute("href")!).filter(href => !href.startsWith("/images/")))],
  );
  for (const href of destinations) {
    expect((await request.get(href)).status(), href).toBe(200);
  }
  const images = await page.locator("main img").evaluateAll(images =>
    [...new Set(images.map(image => {
      const url = new URL((image as HTMLImageElement).src, location.href);
      return url.searchParams.get("url") || url.pathname;
    }).filter(src => src.startsWith("/images/case-study/")))],
  );
  expect(images).toHaveLength(8);
  for (const src of images) expect((await request.get(src)).status(), src).toBe(200);

  const captures = page.getByRole("link", { name: /Ampliar captura de/ });
  await expect(captures).toHaveCount(5);
  for (const href of await captures.evaluateAll(links => links.map(link => (link as HTMLAnchorElement).getAttribute("href")))) {
    const asset = await request.get(href!);
    expect(asset.status()).toBe(200);
    expect(asset.headers()["content-type"]).toContain("image/webp");
  }
  await page.locator("#telas").scrollIntoViewIfNeeded();
  const [popup] = await Promise.all([page.waitForEvent("popup"), captures.first().click()]);
  await expect(popup).toHaveURL(/\/images\/case-study\/cardapio-desktop.webp$/);
  await popup.close();
  expect(errors).toEqual([]);
});

test("case study tem acesso no rodapé e demonstrações com destinos funcionais", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("contentinfo").getByRole("link", { name: "Case study do projeto" }).click();
  await expect(page).toHaveURL(/case-study$/);

  await page.getByRole("link", { name: "Abrir site", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("button", { name: "Abrir menu", exact: true })).toBeVisible();

  await page.goto("/case-study#demonstracao");
  await page.getByRole("link", { name: /Explorar cardápio/ }).click();
  await expect(page).toHaveURL(/cardapio$/);
  await expect(page.getByRole("button", { name: "Todos", exact: true })).toBeVisible();

  await page.goto("/case-study#demonstracao");
  await page.getByRole("link", { name: /Abrir painel demo/ }).click();
  await expect(page).toHaveURL(/admin$/);
  await page.getByRole("link", { name: "Escolher perfil demo", exact: true }).click();
  await page.getByRole("button", { name: /Administrador Demo/ }).click();
  await expect(page.getByRole("heading", { name: "Sua operação, em um olhar." })).toBeVisible();

  await page.goto("/case-study");
  await page.getByRole("link", { name: "Experimentar Painel demonstrativo", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Sua operação, em um olhar." })).toBeVisible();
});

test("case study é responsivo, respeita movimento reduzido e passa na auditoria automática", async ({ page }) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/case-study");
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px`).toBe(true);
  }
  const animations = await page.locator("main").evaluate(main => main.getAnimations({ subtree: true }).filter(animation => animation.playState === "running").length);
  expect(animations).toBe(0);
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(result.violations, `${width}px`).toEqual([]);
  }
  // O link para pular ao conteúdo continua acessível por teclado.
  await page.goto("/case-study");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Pular para o conteúdo" })).toBeFocused();
});
