import { test, expect, type Page } from "@playwright/test";
async function admin(page: Page) {
  await page.goto("/login");
  await page.getByRole("button", {
    name: /Administrador Demo/
  }).click();
  await expect(page.getByRole("heading", {
    level: 1
  })).toHaveText("Sua operação, em um olhar.");
}
async function order(page: Page) {
  await page.goto("/cardapio");
  await page.getByRole("button", {
    name: "Adicionar Cidade Original ao carrinho",
    exact: true
  }).click();
  await page.getByRole("dialog").getByRole("button", {
    name: "Adicionar ao carrinho",
    exact: true
  }).click();
  await page.goto("/checkout");
  const form = page.locator("form:visible");
  await form.getByLabel(/Retirada no balcão/).check();
  await form.getByLabel("Nome", {
    exact: true
  }).fill("Cliente V3 Teste");
  await form.getByLabel("Telefone", {
    exact: true
  }).fill("41999990000");
  await page.getByRole("button", {
    name: "Simular pedido",
    exact: true
  }).click();
  await expect(page.getByRole("heading", {
    name: "Seu pedido de teste foi recebido."
  })).toBeVisible();
  return await page.locator(".order-detail-top h3").innerText();
}
test("V3 pedido mantém snapshot, sincroniza status entre abas e persiste", async ({
  page,
  context
}) => {
  const number = await order(page);
  await page.getByRole("link", {
    name: "Acompanhar pedido"
  }).click();
  const customer = page.locator(".customer-order").filter({
    hasText: number
  });
  await expect(customer).toContainText("Recebido");
  const manager = await context.newPage();
  await admin(manager);
  await manager.goto("/admin/pedidos");
  const card = manager.locator(".admin-order").filter({
    hasText: number
  });
  await card.getByRole("button", {
    name: "Avançar para Em preparação"
  }).click();
  await expect(customer.locator("summary")).toContainText("Em preparação");
  await card.getByRole("button", {
    name: "Avançar para Pronto"
  }).click();
  await card.getByRole("button", {
    name: "Avançar para Concluído"
  }).click();
  await expect(customer.locator("summary")).toContainText("Concluído");
  await page.reload();
  await expect(page.locator(".customer-order").filter({
    hasText: number
  })).toContainText("Concluído");
  await manager.goto("/admin/produtos");
  await manager.getByRole("button", {
    name: "Editar Cidade Original",
    exact: true
  }).click();
  await manager.getByRole("dialog").getByLabel("Preço em reais").fill("99,90");
  await manager.getByRole("dialog").getByRole("button", {
    name: "Salvar produto"
  }).click();
  await page.locator(".customer-order").filter({
    hasText: number
  }).locator("summary").click();
  await expect(page.locator(".customer-order[open] .order-total")).toContainText("29,90");
  await manager.goto("/admin/relatorios");
  await manager.getByLabel("Incluir dados de exemplo").uncheck();
  await expect(manager.locator(".admin-stat").filter({
    hasText: "Faturamento fictício"
  })).toContainText("29,90");
  await manager.close();
});
test("V3 produto novo, disponibilidade, edição e exclusão refletem no cardápio", async ({
  page,
  context
}) => {
  await admin(page);
  await page.goto("/admin/produtos");
  const shop = await context.newPage();
  await shop.goto("/cardapio");
  await page.getByRole("button", {
    name: "Novo produto",
    exact: true
  }).click();
  let dialog = page.getByRole("dialog");
  await dialog.getByLabel("Nome do produto").fill("Burger V3 Especial");
  await dialog.getByLabel("Descrição", {
    exact: true
  }).fill("Um sabor fictício para testar a gestão local.");
  await dialog.getByLabel("Preço em reais").fill("45,90");
  await dialog.getByLabel("Ingredientes", {
    exact: false
  }).fill("Pão, carne, cheddar");
  await dialog.getByRole("button", {
    name: "Salvar produto"
  }).click();
  const product = shop.locator(".product-card").filter({
    hasText: "Burger V3 Especial"
  });
  await expect(product).toBeVisible();
  await expect(product).toContainText("45,90");
  await product.getByRole("button", {
    name: "Adicionar Burger V3 Especial ao carrinho"
  }).click();
  await shop.getByRole("dialog").getByLabel(/Bacon extra/).check();
  await expect(shop.locator(".customizer-total")).toContainText("50,90");
  await shop.getByRole("dialog").getByRole("button", {
    name: "Adicionar ao carrinho",
    exact: true
  }).click();
  const adminProduct = page.locator(".admin-product").filter({
    hasText: "Burger V3 Especial"
  });
  await adminProduct.getByRole("button", {
    name: "Marcar como indisponível"
  }).click();
  await expect(product.getByRole("button", {
    name: "Adicionar Burger V3 Especial ao carrinho"
  })).toBeDisabled();
  await shop.goto("/carrinho");
  await expect(shop.locator(".cart-item")).toHaveCount(0);
  await adminProduct.getByRole("button", {
    name: "Tornar disponível"
  }).click();
  await page.reload();
  await expect(page.locator(".admin-product").filter({
    hasText: "Burger V3 Especial"
  })).toContainText("Disponível");
  await page.getByRole("button", {
    name: "Editar Burger V3 Especial"
  }).click();
  dialog = page.getByRole("dialog");
  await dialog.getByLabel("Preço em reais").fill("49,90");
  await dialog.getByRole("button", {
    name: "Salvar produto"
  }).click();
  await shop.goto("/cardapio");
  await expect(shop.locator(".product-card").filter({
    hasText: "Burger V3 Especial"
  })).toContainText("49,90");
  await page.getByRole("button", {
    name: "Excluir Burger V3 Especial"
  }).click();
  await page.getByRole("button", {
    name: "Manter alterações",
    exact: true
  }).click();
  await expect(page.locator(".admin-product").filter({
    hasText: "Burger V3 Especial"
  })).toHaveCount(1);
  await page.getByRole("button", {
    name: "Excluir Burger V3 Especial"
  }).click();
  await page.getByRole("button", {
    name: "Sim, excluir produto",
    exact: true
  }).click();
  await expect(shop.locator(".product-card").filter({
    hasText: "Burger V3 Especial"
  })).toHaveCount(0);
  await page.getByRole("button", {
    name: "Restaurar cardápio",
    exact: true
  }).click();
  await page.getByRole("button", {
    name: "Sim, restaurar cardápio",
    exact: true
  }).click();
  await expect(page.locator(".admin-product")).toHaveCount(12);
  await shop.close();
});
test("V3 reservas são registradas, filtradas e atualizadas pelo administrador", async ({
  page,
  context
}) => {
  await page.goto("/reservas");
  const form = page.locator("form:visible");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const date = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
  await form.getByLabel("Seu nome", {
    exact: true
  }).fill("Reserva Cliente V3");
  await form.getByLabel("Telefone com DDD").fill("41999990000");
  await form.getByLabel("Data", {
    exact: true
  }).fill(date);
  await form.getByLabel("Horário", {
    exact: true
  }).selectOption("19:30");
  await form.getByLabel("Quantidade de pessoas").selectOption("4");
  await form.getByRole("button", {
    name: "Simular reserva"
  }).click();
  await expect(page.locator(".my-reservations")).toContainText("Reserva Cliente V3");
  const manager = await context.newPage();
  await admin(manager);
  await manager.goto("/admin/reservas");
  await manager.getByLabel("Filtrar por data").fill(date);
  const reservation = manager.locator(".admin-reservation-grid article").filter({
    hasText: "Reserva Cliente V3"
  });
  await expect(reservation).toContainText("4 pessoas");
  await reservation.getByRole("button", {
    name: "Confirmar reserva"
  }).click();
  await expect(page.locator(".my-reservations article").filter({
    hasText: "Reserva Cliente V3"
  })).toContainText("Confirmada");
  await reservation.getByRole("button", {
    name: "Cancelar reserva"
  }).click();
  await manager.getByRole("button", {
    name: "Sim, cancelar reserva"
  }).click();
  await expect(page.locator(".my-reservations article").filter({
    hasText: "Reserva Cliente V3"
  })).toContainText("Cancelada");
  await page.reload();
  await expect(page.locator(".my-reservations")).toContainText("Reserva Cliente V3");
  await manager.close();
});
test("V3 cancela pedidos com confirmação e restaura somente após aprovação", async ({
  page
}) => {
  const number = await order(page);
  await admin(page);
  await page.goto("/admin/pedidos");
  const card = page.locator(".admin-order").filter({
    hasText: number
  });
  await card.getByRole("button", {
    name: "Cancelar pedido",
    exact: true
  }).click();
  await page.getByRole("button", {
    name: "Manter pedido"
  }).click();
  await expect(card).toContainText("Recebido");
  await card.getByRole("button", {
    name: "Cancelar pedido",
    exact: true
  }).click();
  await page.getByRole("button", {
    name: "Sim, cancelar pedido"
  }).click();
  await expect(card.locator(".status-badge").first()).toHaveText("Cancelado");
  await expect(card.getByRole("button", {
    name: /Avançar/
  })).toHaveCount(0);
  await page.goto("/admin/configuracoes");
  await page.getByRole("button", {
    name: "Restaurar dados de demonstração",
    exact: true
  }).click();
  await page.getByRole("button", {
    name: "Manter meus dados"
  }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("cidade-do-sabor:demo:v3") || "{}").orders.some((o: {
    number: string;
  }) => o.number.startsWith("CS-")))).toBe(true);
  await page.getByRole("button", {
    name: "Restaurar dados de demonstração",
    exact: true
  }).click();
  await page.getByRole("button", {
    name: "Sim, restaurar demonstração",
    exact: true
  }).click();
  await page.reload();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("cidade-do-sabor:demo:v3") || "{}").orders.every((o: {
    sample: boolean;
  }) => o.sample))).toBe(true);
});
test("V3 painel responsivo e páginas administrativas sem erros ou violações", async ({
  page,
  isMobile
}) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/admin");
  await expect(page.getByRole("link", {
    name: "Escolher perfil demo"
  })).toBeVisible();
  await admin(page);
  if (isMobile) {
    await page.getByRole("button", {
      name: "Abrir navegação administrativa"
    }).click();
    await page.getByRole("navigation", {
      name: "Administração",
      exact: true
    }).getByRole("link", {
      name: "Pedidos",
      exact: true
    }).click();
    await expect(page).toHaveURL(/admin\/pedidos$/);
  }
  const {
    default: AxeBuilder
  } = await import("@axe-core/playwright");
  for (const route of ["/admin", "/admin/pedidos", "/admin/produtos", "/admin/reservas", "/admin/clientes", "/admin/relatorios", "/admin/configuracoes"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", {
      level: 1
    })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const result = await new AxeBuilder({
      page
    }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(result.violations, route).toEqual([]);
  }
  expect(errors).toEqual([]);
  await page.goto("/login");
  await page.getByRole("button", {
    name: /Cliente Demo/
  }).click();
  await expect(page).toHaveURL(/meus-pedidos/);
  await page.goto("/admin");
  await expect(page.getByRole("link", {
    name: "Escolher perfil demo"
  })).toBeVisible();
});
test("V3 recupera armazenamento inválido e permite uso sem persistência", async ({
  page
}) => {
  await page.goto("/login");
  await page.evaluate(() => localStorage.setItem("cidade-do-sabor:demo:v3", "{invalido"));
  await page.reload();
  await page.getByRole("button", {
    name: /Administrador Demo/
  }).click();
  await expect(page.getByRole("heading", {
    level: 1
  })).toHaveText("Sua operação, em um olhar.");
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage disabled", "QuotaExceededError");
    };
  });
  await page.reload();
  await expect(page.locator(".storage-warning")).toBeVisible();
  await page.goto("/admin/produtos");
  await page.getByRole("button", {
    name: "Editar Cidade Original",
    exact: true
  }).click();
  await page.getByRole("dialog").getByLabel("Preço em reais").fill("31,90");
  await page.getByRole("dialog").getByRole("button", {
    name: "Salvar produto"
  }).click();
  await expect(page.locator(".admin-product").filter({
    has: page.getByRole("heading", {
      name: "Cidade Original",
      exact: true
    })
  })).toContainText("31,90");
});
