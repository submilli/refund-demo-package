import { post } from "submilli:http";
import secrets from "submilli:secrets";
import { check } from "submilli:security";

export interface Request {
  orderId: string;
  customer: { name: string; email: string };
  reason: string;
  amount: number;
  currency: string;
  itemSummary: string;
  eligible: boolean;
  eligibilityReason: string;
}
export interface Order {
  orderId: string;
  customer: { name: string; email: string };
  reason: string;
  amount: number;
  currency: string;
  itemSummary: string;
  eligible: boolean;
  eligibilityReason: string;
  paidAmount: number;
  orderHistory: { at: string; event: string; detail: string }[];
}
export interface Delivery {
  orderId: string;
  status: string;
  condition: string;
  deliveredAt: string;
  carrier: string;
  trackingNumber: string;
  scanHistory: { at: string; location: string; event: string; detail: string }[];
}
export interface Policy {
  windowDays: number;
  damage: { fullRefund: boolean; criterion: string };
  asOf: string;
}
export interface Receipt {
  receiptId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  issuedAt: string;
  note: string;
}

function invoke(operation: string, args: string): string {
  const token = secrets.get("REFUND_DEMO_TOKEN");
  if (token === null) throw new Error("The refund sandbox session is not connected.");
  const headers = new Map<string, string>();
  headers.set("Authorization", "Bearer " + token);
  headers.set("Content-Type", "application/json");
  const response = post("https://yc-demo-sy15.onrender.com/sandbox/refunds/" + operation, args, headers);
  if (!response.ok) throw new Error(response.body);
  return response.body;
}

/**
 * Read today's two fictional damage claims. Amounts are USD, not cents.
 * @capability refund-demo/requests.read {}
 */
export function listRequests(): { requests: Request[] } {
  check("refund-demo/requests.read", {});
  return JSON.parse(invoke("list_refund_requests", "{}")) as { requests: Request[] };
}

/**
 * Read the full order, including its history. Filter it in code before returning a summary.
 * @capability refund-demo/orders.read { orderId: string }
 */
export function getOrder(orderId: string): Order {
  check("refund-demo/orders.read", { orderId });
  return JSON.parse(invoke("get_order", JSON.stringify({ orderId }))) as Order;
}

/**
 * Read delivery evidence and the full tracking history.
 * @capability refund-demo/deliveries.read { orderId: string }
 */
export function getDelivery(orderId: string): Delivery {
  check("refund-demo/deliveries.read", { orderId });
  return JSON.parse(invoke("get_delivery", JSON.stringify({ orderId }))) as Delivery;
}

/**
 * Read the retailer's eligibility policy. The Blueprint separately controls authority.
 * @capability refund-demo/policy.read {}
 */
export function getPolicy(): Policy {
  check("refund-demo/policy.read", {});
  return JSON.parse(invoke("get_refund_policy", "{}")) as Policy;
}

/**
 * Issue a full refund in the fictional ledger. No real money moves.
 * Amount is in USD (49 or 350), not cents. Repeating the same refund returns its existing receipt.
 * The runtime checks the amount against the Blueprint before the API is called.
 * @capability refund-demo/refunds.issue { orderId: string, amount: number }
 */
export function issueRefund(orderId: string, amount: number): Receipt {
  check("refund-demo/refunds.issue", { orderId, amount });
  return JSON.parse(invoke("issue_refund", JSON.stringify({ orderId, amount }))) as Receipt;
}

/**
 * Read recorded receipts from this sandbox session.
 * @capability refund-demo/refunds.read {}
 */
export function listRefunds(): { refunds: Receipt[] } {
  check("refund-demo/refunds.read", {});
  return JSON.parse(invoke("list_refunds", "{}")) as { refunds: Receipt[] };
}
