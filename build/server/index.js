import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts, useLoaderData, useFetcher } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as LabelPrimitive from "@radix-ui/react-label";
import dotenv from "dotenv";
import mariadb from "mariadb";
import { format } from "date-fns";
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
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Alert = React.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    role: "alert",
    className: cn(alertVariants({ variant }), className),
    ...props
  }
));
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h5",
  {
    ref,
    className: cn("mb-1 font-medium leading-none tracking-tight", className),
    ...props
  }
));
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("text-sm [&_p]:leading-relaxed", className),
    ...props
  }
));
AlertDescription.displayName = "AlertDescription";
function UITest() {
  return /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto p-6 space-y-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "UI Components Test" }),
    /* @__PURE__ */ jsxs(Alert, { variant: "default", children: [
      /* @__PURE__ */ jsx(AlertTitle, { children: "Success!" }),
      /* @__PURE__ */ jsx(AlertDescription, { children: "This is a test alert component." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-x-2", children: [
      /* @__PURE__ */ jsx(Button, { variant: "default", children: "Default" }),
      /* @__PURE__ */ jsx(Button, { variant: "destructive", children: "Destructive" }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", children: "Outline" }),
      /* @__PURE__ */ jsx(Button, { variant: "secondary", children: "Secondary" }),
      /* @__PURE__ */ jsx(Button, { variant: "ghost", children: "Ghost" }),
      /* @__PURE__ */ jsx(Button, { variant: "link", children: "Link" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Card Component" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: "This is a card body. Add any content here." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Name" }),
      /* @__PURE__ */ jsx(Input, { id: "name", placeholder: "Enter your name" })
    ] })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: UITest
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
  const ownerName = String(formData.get("owner_name"));
  const depositorName = String(formData.get("depositor_name"));
  const reconciliation = String(formData.get("reconciliation"));
  const refNumber = String(formData.get("ref_number"));
  const depositNumber = String(formData.get("deposit_number"));
  const bankName = String(formData.get("bank_name"));
  const accountType = String(formData.get("account_type"));
  const comment = String(formData.get("comment"));
  const old_id = String(formData.get("old_id"));
  const depositDate = new Date(date);
  const formattedDate = depositDate.toISOString().slice(0, 19).replace("T", " ");
  if (intent === "create") {
    await query(
      `INSERT INTO deposits 
      (dp_id, amount, deposit_date, owner_name, depositor_name, reconciliation, ref_number, deposit_number, bank_name, account_type, comment) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, amount, formattedDate, ownerName, depositorName, reconciliation, refNumber, depositNumber, bankName, accountType, comment]
    );
  } else if (intent === "update") {
    await query(
      `UPDATE deposits SET 
      dp_id = ?, amount = ?, deposit_date = ?, owner_name = ?, depositor_name = ?, reconciliation = ?, ref_number = ?, deposit_number = ?, bank_name = ?, account_type = ?, comment = ?
      WHERE dp_id = ?`,
      [id, amount, formattedDate, ownerName, depositorName, reconciliation, refNumber, depositNumber, bankName, accountType, comment, old_id]
    );
  } else if (intent === "delete") {
    await query("DELETE FROM deposits WHERE dp_id = ?", [id]);
  }
  return json({ ok: true });
};
function DepositsPage() {
  const deposits = useLoaderData();
  const fetcher = useFetcher();
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto p-4", children: [
    /* @__PURE__ */ jsxs(fetcher.Form, { method: "post", className: "mb-8 p-4 border rounded grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "col-span-2 text-lg font-bold mb-2", children: "Add Deposit" }),
      /* @__PURE__ */ jsx("input", { name: "id", placeholder: "Deposit ID", className: "p-2 border", required: true }),
      /* @__PURE__ */ jsx("input", { name: "amount", type: "number", placeholder: "Amount", step: "0.01", className: "p-2 border", required: true }),
      /* @__PURE__ */ jsx("input", { name: "date", type: "date", className: "p-2 border", required: true }),
      /* @__PURE__ */ jsx("input", { name: "owner_name", placeholder: "Owner Name", className: "p-2 border" }),
      /* @__PURE__ */ jsx("input", { name: "depositor_name", placeholder: "Depositor Name", className: "p-2 border" }),
      /* @__PURE__ */ jsx("input", { name: "reconciliation", placeholder: "Reconciliation", className: "p-2 border" }),
      /* @__PURE__ */ jsx("input", { name: "ref_number", placeholder: "Reference Number", className: "p-2 border" }),
      /* @__PURE__ */ jsx("input", { name: "deposit_number", placeholder: "Deposit Number", className: "p-2 border" }),
      /* @__PURE__ */ jsx("input", { name: "bank_name", placeholder: "Bank Name", className: "p-2 border" }),
      /* @__PURE__ */ jsx("input", { name: "account_type", placeholder: "Account Type", className: "p-2 border" }),
      /* @__PURE__ */ jsx("textarea", { name: "comment", placeholder: "Comment", className: "col-span-2 p-2 border" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          name: "intent",
          value: "create",
          className: "col-span-2 bg-blue-500 text-white p-2 rounded",
          children: "Create"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: deposits.map((d) => /* @__PURE__ */ jsx("div", { className: "p-4 border rounded", children: /* @__PURE__ */ jsxs(fetcher.Form, { method: "post", className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsx("input", { name: "id", defaultValue: d.dp_id, className: "p-2 border", required: true }),
      /* @__PURE__ */ jsx("input", { name: "amount", type: "number", step: "0.01", defaultValue: d.amount, className: "p-2 border", required: true }),
      /* @__PURE__ */ jsx("input", { name: "date", type: "date", defaultValue: d.deposit_date ? format(new Date(d.deposit_date), "yyyy-MM-dd") : "", className: "p-2 border", required: true }),
      /* @__PURE__ */ jsx("input", { name: "owner_name", defaultValue: d.owner_name, className: "p-2 border" }),
      /* @__PURE__ */ jsx("input", { name: "depositor_name", defaultValue: d.depositor_name, className: "p-2 border" }),
      /* @__PURE__ */ jsx("input", { name: "reconciliation", defaultValue: d.reconciliation, className: "p-2 border" }),
      /* @__PURE__ */ jsx("input", { name: "ref_number", defaultValue: d.ref_number, className: "p-2 border" }),
      /* @__PURE__ */ jsx("input", { name: "deposit_number", defaultValue: d.deposit_number, className: "p-2 border" }),
      /* @__PURE__ */ jsx("input", { name: "bank_name", defaultValue: d.bank_name, className: "p-2 border" }),
      /* @__PURE__ */ jsx("input", { name: "account_type", defaultValue: d.account_type, className: "p-2 border" }),
      /* @__PURE__ */ jsx("textarea", { name: "comment", defaultValue: d.comment, className: "col-span-2 p-2 border" }),
      /* @__PURE__ */ jsx("input", { type: "hidden", name: "old_id", value: d.dp_id }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-2 flex gap-2", children: [
        /* @__PURE__ */ jsx("button", { type: "submit", name: "intent", value: "update", className: "bg-green-500 text-white p-2 rounded flex-1", children: "Update" }),
        /* @__PURE__ */ jsx("button", { type: "submit", name: "intent", value: "delete", className: "bg-red-500 text-white p-2 rounded flex-1", children: "Delete" })
      ] })
    ] }) }, d.dp_id)) })
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: DepositsPage,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-mLkxdWcc.js", "imports": ["/assets/index-BXS1DM4N.js", "/assets/components-CseOpdsb.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-BKEYO1xv.js", "imports": ["/assets/index-BXS1DM4N.js", "/assets/components-CseOpdsb.js"], "css": ["/assets/root-DknM-Y9K.css"] }, "routes/ui-test": { "id": "routes/ui-test", "parentId": "root", "path": "ui-test", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/ui-test-70J1_mB3.js", "imports": ["/assets/index-BXS1DM4N.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-DjHgYR8V.js", "imports": ["/assets/index-BXS1DM4N.js", "/assets/components-CseOpdsb.js"], "css": [] } }, "url": "/assets/manifest-84b811b7.js", "version": "84b811b7" };
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
  "routes/ui-test": {
    id: "routes/ui-test",
    parentId: "root",
    path: "ui-test",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
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
