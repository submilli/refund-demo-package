# Refund demo

This Package connects to the YC demo's fictional retail sandbox. No real money moves. Requests, orders, delivery histories and receipts are scoped to this chat's sandbox token.

Discover the API declarations for exact types. `listRequests`, `getOrder`, `getDelivery` and `getPolicy` provide evidence. Join and filter that data in one program, returning only the facts needed for the decision. `issueRefund(orderId, amount)` issues a full sandbox refund; amounts are in USD, not cents. Repeating an identical refund returns its existing receipt. `listRefunds` verifies recorded outcomes.

Every exported operation makes a semantic Capability check before contacting the sandbox API. The Blueprint controls refund amounts using `refund-demo/refunds.issue` and its numeric `amount` field. A denial comes from the runtime. The human must edit and save the Blueprint before a newly permitted operation can succeed.
