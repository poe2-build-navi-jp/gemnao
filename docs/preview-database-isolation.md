# Preview database isolation

New preview deployments explicitly have no D1 binding. Production retains its existing DB and variables. Preview articles and local browser notes remain usable, but server-backed feedback, contact, Discord-directory and admin functions cannot use a database. Do not treat an unavailable preview write as a saved answer.

No new database or credential is required. The existing Pages Git integration applies `env.preview` when a new preview deployment is built. After that build succeeds, verify via the existing read-only controller that the current Pages preview DB bindings no longer include production. Keep the migration gate unchanged; a successful build alone is not binding readback.

This does not prove that historical deployment URLs lost their old bindings. Do not submit test votes on old previews. An older branch with the old Wrangler file can also restore the shared preview configuration when deployed: incorporate this configuration change into active branches, including feature PR #75, before publishing further previews. Any cleanup of historical deployments is a separate reviewed action.

Local checks (with an isolated writable HOME and metrics disabled):

    node scripts/check-preview-bindings.mjs
    node scripts/check-preview-bindings.mjs --built

The second check follows the normal build and Pages preparation. It verifies that Vinext's generated Workers configuration and redirect were removed, leaving the repository Pages configuration authoritative.

Reference: https://developers.cloudflare.com/pages/functions/wrangler-configuration/#production-and-preview-deployments
