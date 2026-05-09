# Deployment

CashCat can be deployed in a split architecture:

- `GitHub Pages` for the public front end
- `AMD GPU Droplet` for the public API layer

## Front End

The public site is static and can be served directly from GitHub Pages.

Primary files:

- `index.html`
- `live-demo.html`
- `proof-demo.html`
- `api.html`
- `config.js`

## Public API

The repo includes a lightweight public API service:

- `api-server.js`

Endpoints:

- `GET /health`
- `POST /api/agent-payment-flow`
- `POST /api/multi-agent-flow`
- `POST /api/proof-flow`

## Local Run

Static site:

```bash
python -m http.server 4174
```

API:

```bash
node api-server.js
```

## GitHub Pages + Remote API

Set the front end to call a public API by using:

- `config.js`
- or `?apiBase=https://your-api-host`

Example:

```text
https://monkeyjack123.github.io/AMD-CashCat-Project-Agent-Payment/?apiBase=https://your-api-host
```

## AMD GPU Deployment Idea

Deploy the API service on the AMD droplet, then place a small reverse proxy such as Nginx in front of it.

Suggested public shape:

- `https://your-domain/health`
- `https://your-domain/api/agent-payment-flow`
- `https://your-domain/api/multi-agent-flow`

This lets the public site stay stable on Pages while the workflow logic remains on cloud infrastructure.
