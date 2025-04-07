import "zone.js/node"
import express from "express"

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express()
  return server // Return a valid Express app instead of null
}

function run(): void {
  const port = process.env["PORT"] || 4000

  // Start up the Node server
  const server = app()
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`)
  })
}

// This is a dummy export to satisfy the Angular compiler
export default function bootstrap() {
  return null
}


