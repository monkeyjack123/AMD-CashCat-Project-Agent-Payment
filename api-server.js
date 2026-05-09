const http = require("http");
const { URL } = require("url");
const siteData = require("./site-data.js");

const PORT = Number(process.env.PORT || "8080");
const HOST = process.env.HOST || "0.0.0.0";

function json(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function notFound(res) {
  json(res, 404, {
    error: "not_found"
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/health") {
    json(res, 200, {
      ok: true,
      service: "cashcat-public-api",
      model: "qwen2.5-14b",
      provider: "amd-vllm"
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/agent-payment-flow") {
    try {
      const payload = await readJson(req);
      const result = siteData.buildStaticAgentFlow(payload);
      json(res, 200, result);
      return;
    } catch (error) {
      json(res, 400, { error: error.message || "invalid_request" });
      return;
    }
  }

  if (req.method === "POST" && url.pathname === "/api/multi-agent-flow") {
    try {
      const payload = await readJson(req);
      const result = siteData.buildStaticMultiAgentFlow(payload);
      json(res, 200, result);
      return;
    } catch (error) {
      json(res, 400, { error: error.message || "invalid_request" });
      return;
    }
  }

  if (req.method === "POST" && url.pathname === "/api/proof-flow") {
    try {
      const payload = await readJson(req);
      const result = siteData.buildStaticAgentFlow({
        task: payload.task || "Buy premium search results and a research dataset under a bounded budget.",
        principalId: payload.principalId,
        agentId: payload.agentId,
        naturalLanguagePolicy: payload.naturalLanguagePolicy,
        maxAmount: payload.spendAmount || payload.maxAmount,
        category: payload.category,
        currency: payload.currency || "USD"
      });
      json(res, 200, result);
      return;
    } catch (error) {
      json(res, 400, { error: error.message || "invalid_request" });
      return;
    }
  }

  notFound(res);
});

server.listen(PORT, HOST, () => {
  console.log(`CashCat public API listening on http://${HOST}:${PORT}`);
});
