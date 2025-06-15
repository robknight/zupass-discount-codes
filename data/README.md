# Why is this folder here?

Artifacts (ZK circuits, keys, etc.) are placed in `data/artifacts` so that Next.js API routes can access them at runtime using Node.js file APIs. This is needed because Vercel serverless functions **cannot** read files from `public/` at runtime—only via HTTP.

- Use `data/artifacts` for files needed by backend/serverless code.
- Use `public/artifacts` for files that must be served to the browser or accessed via URL.

**Note:** The [`gpcVerify`](https://docs.pcd.team/functions/_pcd_gpc.gpcVerify.html) function only accepts a URL for the artifacts path when running in the browser (due to a limitation in snarkjs). On the server (Node.js), it requires a filesystem path. 