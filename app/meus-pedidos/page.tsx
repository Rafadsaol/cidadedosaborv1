import { PageHeading } from "@/components/ui/section-heading";
import { CustomerOrders } from "@/components/orders/customer-orders";
export const metadata = { title: "Meus pedidos de teste" };
export default function Page() { return <><PageHeading eyebrow="SUA HISTÓRIA NA CIDADE" title="Cada pedido, um bom momento." description="Acompanhe seus pedidos demonstrativos e explore os detalhes das suas combinações favoritas." /><CustomerOrders /></>; }
