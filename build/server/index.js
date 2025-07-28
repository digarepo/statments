import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts, useLoaderData, useFetcher } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import dotenv from "dotenv";
import mariadb from "mariadb";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
dotenv.config();
const pool = mariadb.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "12345",
  database: process.env.DB_NAME || "users",
  port: Number(process.env.DB_PORT) || 3306,
  connectionLimit: 5
});
async function query(sql, params) {
  let conn;
  try {
    conn = await pool.getConnection();
    const results = await conn.query(sql, params);
    console.log(`Executed query: ${sql}`);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
}
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Successfully connected to MariaDB pool.");
    conn.release();
  } catch (err) {
    console.error("Failed to connect to MariaDB pool:", err);
  }
})();
const meta = () => {
  return [
    { title: "Deposit Management" },
    { name: "description", content: "Manage deposit records" }
  ];
};
const loader = async () => {
  const deposits = await query("SELECT * FROM deposits ORDER BY deposit_date DESC");
  return json(deposits);
};
const action = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const id = String(formData.get("id"));
  const amount = Number(formData.get("amount"));
  const date = String(formData.get("date"));
  const old_id = String(formData.get("old_id"));
  const depositDate = new Date(date);
  const formattedDate = depositDate.toISOString().slice(0, 19).replace("T", " ");
  if (intent === "create") {
    await query(
      "INSERT INTO deposits (dp_id, amount, deposit_date) VALUES (?, ?, ?)",
      [id, amount, formattedDate]
    );
  } else if (intent === "update") {
    await query(
      "UPDATE deposits SET dp_id = ?, amount = ?, deposit_date = ? WHERE dp_id = ?",
      [id, amount, formattedDate, old_id]
    );
  } else if (intent === "delete") {
    await query("DELETE FROM deposits WHERE dp_id = ?", [id]);
  }
  return json({ ok: true });
};
function DepositsPage() {
  const deposits = useLoaderData();
  const fetcher = useFetcher();
  return /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto p-4", children: [
    /* @__PURE__ */ jsxs(fetcher.Form, { method: "post", className: "mb-8 p-4 border rounded", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold mb-2", children: "Add Deposit" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          name: "id",
          placeholder: "Deposit ID",
          className: "w-full p-2 border mb-2",
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          name: "amount",
          type: "number",
          placeholder: "Amount",
          step: "0.01",
          className: "w-full p-2 border mb-2",
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          name: "date",
          type: "date",
          className: "w-full p-2 border mb-2",
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          name: "intent",
          value: "create",
          className: "bg-blue-500 text-white p-2 rounded",
          children: "Create"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: deposits.map((d) => /* @__PURE__ */ jsx("div", { className: "p-4 border rounded", children: /* @__PURE__ */ jsxs(fetcher.Form, { method: "post", className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          name: "id",
          defaultValue: d.dp_id,
          className: "p-2 border",
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          name: "amount",
          type: "number",
          step: "0.01",
          defaultValue: d.amount,
          className: "p-2 border",
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          name: "date",
          type: "date",
          defaultValue: d.deposit_date ? d.deposit_date.split("T")[0] || d.deposit_date.split(" ")[0] : "",
          className: "p-2 border",
          required: true
        }
      ),
      /* @__PURE__ */ jsx("input", { type: "hidden", name: "old_id", value: d.dp_id }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            name: "intent",
            value: "update",
            className: "bg-green-500 text-white p-2 rounded flex-1",
            children: "Update"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            name: "intent",
            value: "delete",
            className: "bg-red-500 text-white p-2 rounded flex-1",
            children: "Delete"
          }
        )
      ] })
    ] }) }, d.dp_id)) })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: DepositsPage,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CtHEAkve.js", "imports": ["/assets/components-DuEQsw7T.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-DoNHjzvZ.js", "imports": ["/assets/components-DuEQsw7T.js"], "css": ["/assets/root-Cofw7XHV.css"] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-B8LiUUb9.js", "imports": ["/assets/components-DuEQsw7T.js"], "css": [] } }, "url": "/assets/manifest-d9e19647.js", "version": "d9e19647" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
