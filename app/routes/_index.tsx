 import {
  json,
  type ActionFunction,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { query } from "services/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Deposit Management" },
    { name: "description", content: "Manage deposit records" },
  ];
};

type Deposit = {
  dp_id: string;
  amount: number;
  deposit_date: number;
};

// Loader: fetch deposits from the DB
export const loader: LoaderFunction = async () => {
  const deposits = await query("SELECT * FROM deposits ORDER BY deposit_date DESC");
  return json(deposits);
};

// Action: create, update, delete
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const id = String(formData.get("id"));
  const amount = Number(formData.get("amount"));
  const date =String( formData.get("date"));
  const old_id = String(formData.get("old_id"));

  if (intent === "create") {
    await query(
      "INSERT INTO deposits (dp_id, amount, deposit_date) VALUES (?, ?, ?)",
      [id, amount, date]
    );
  } else if (intent === "update") {
    await query(
      "UPDATE deposits SET dp_id = ?, amount = ?, deposit_date = ? WHERE dp_id = ?",
      [id, amount, date, old_id]
    );
  } else if (intent === "delete") {
    await query("DELETE FROM deposits WHERE dp_id = ?", [id]);
  }

  return json({ ok: true });
};

// UI component
export default function DepositsPage() {
  const deposits = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Create Deposit Form */}
      <fetcher.Form method="post" className="mb-8 p-4 border rounded">
        <h2 className="text-lg font-bold mb-2">Add Deposit</h2>
        <input
          name="id"
          placeholder="Deposit ID"
          className="w-full p-2 border mb-2"
          required
        />
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          step="0.01"
          className="w-full p-2 border mb-2"
          required
        />
        <input
          name="date"
          type="date"
          className="w-full p-2 border mb-2"
          required
        />
        <button
          type="submit"
          name="intent"
          value="create"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Create
        </button>
      </fetcher.Form>

      {/* Deposit List */}
      <div className="space-y-4">
        {deposits.map((d: Deposit) => (
          <div key={d.dp_id} className="p-4 border rounded">
            <fetcher.Form method="post" className="flex flex-col gap-2">
              <input
                name="id"
                defaultValue={d.dp_id}
                className="p-2 border"
                required
              />
              <input
                name="amount"
                type="number"
                step="0.01"
                defaultValue={d.amount}
                className="p-2 border"
                required
              />
              <input
                name="date"
                type="date"
                defaultValue={d.deposit_date}
                className="p-2 border"
                required
              /> 
              <input type="hidden" name="old_id" value={d.dp_id} />
              <div className="flex gap-2">
                <button
                  type="submit"
                  name="intent"
                  value="update"
                  className="bg-green-500 text-white p-2 rounded flex-1"
                >
                  Update
                </button>
                <button
                  type="submit"
                  name="intent"
                  value="delete"
                  className="bg-red-500 text-white p-2 rounded flex-1"
                >
                  Delete
                </button>
              </div>
            </fetcher.Form>
          </div>
        ))}
      </div>
    </div>
  );
}
