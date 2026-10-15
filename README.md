# @submilli/refund-demo

This fictional refund sandbox Package lets an agent inspect refund requests,
orders, delivery evidence and policy, then issue and verify sandbox refunds.
No real money moves and no standalone backend is included; the Package connects
to the YC demo sandbox using the runtime's `REFUND_DEMO_TOKEN` secret.

Each exported operation performs a semantic Capability check. The Blueprint
controls which operations are allowed and can constrain the refund amount. A
connected runtime and a token are required to call the sandbox.

The Package includes its declarations in `src/lib.ts`, capability metadata in
`capabilities.yaml`, and usage notes in `docs/readme.md`.
