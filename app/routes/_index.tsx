import {
  json,
  type ActionFunction,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { query } from "services/db.server";
import { format } from "date-fns";

export const meta: MetaFunction = () => {
  return [
    { title: "Deposit Management" },
    { name: "description", content: "Manage deposit records" },
  ];
};

type Deposit = {
  dp_id: string;
  amount: number;
  deposit_date: string;
  owner_name: string;
  depositor_name: string;
  reconciliation: string;
  ref_number: string;
  deposit_number: string;
  bank_name: string;
  account_type: string;
  comment: string;
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

// UI component
export default function DepositsPage() {
  const deposits = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Create Deposit Form */}
      <fetcher.Form method="post" className="mb-8 p-4 border rounded grid grid-cols-2 gap-4">
        <h2 className="col-span-2 text-lg font-bold mb-2">Add Deposit</h2>
        <input name="id" placeholder="Deposit ID" className="p-2 border" required />
        <input name="amount" type="number" placeholder="Amount" step="0.01" className="p-2 border" required />
        <input name="date" type="date" className="p-2 border" required />
        <input name="owner_name" placeholder="Owner Name" className="p-2 border" />
        <input name="depositor_name" placeholder="Depositor Name" className="p-2 border" />
        <input name="reconciliation" placeholder="Reconciliation" className="p-2 border" />
        <input name="ref_number" placeholder="Reference Number" className="p-2 border" />
        <input name="deposit_number" placeholder="Deposit Number" className="p-2 border" />
        <input name="bank_name" placeholder="Bank Name" className="p-2 border" />
        <input name="account_type" placeholder="Account Type" className="p-2 border" />
        <textarea name="comment" placeholder="Comment" className="col-span-2 p-2 border"></textarea>
        <button
          type="submit"
          name="intent"
          value="create"
          className="col-span-2 bg-blue-500 text-white p-2 rounded"
        >
          Create
        </button>
      </fetcher.Form>

      {/* Deposit List */}
      <div className="space-y-4">
        {deposits.map((d: Deposit) => (
          <div key={d.dp_id} className="p-4 border rounded">
            <fetcher.Form method="post" className="grid grid-cols-2 gap-2">
              <input name="id" defaultValue={d.dp_id} className="p-2 border" required />
              <input name="amount" type="number" step="0.01" defaultValue={d.amount} className="p-2 border" required />
              <input name="date" type="date" defaultValue={d.deposit_date ? format(new Date(d.deposit_date), "yyyy-MM-dd") : ""} className="p-2 border" required />
              <input name="owner_name" defaultValue={d.owner_name} className="p-2 border" />
              <input name="depositor_name" defaultValue={d.depositor_name} className="p-2 border" />
              <input name="reconciliation" defaultValue={d.reconciliation} className="p-2 border" />
              <input name="ref_number" defaultValue={d.ref_number} className="p-2 border" />
              <input name="deposit_number" defaultValue={d.deposit_number} className="p-2 border" />
              <input name="bank_name" defaultValue={d.bank_name} className="p-2 border" />
              <input name="account_type" defaultValue={d.account_type} className="p-2 border" />
              <textarea name="comment" defaultValue={d.comment} className="col-span-2 p-2 border"></textarea>
              <input type="hidden" name="old_id" value={d.dp_id} />
              <div className="col-span-2 flex gap-2">
                <button type="submit" name="intent" value="update" className="bg-green-500 text-white p-2 rounded flex-1">Update</button>
                <button type="submit" name="intent" value="delete" className="bg-red-500 text-white p-2 rounded flex-1">Delete</button>
              </div>
            </fetcher.Form>
          </div>
        ))}
      </div>
    </div>
  );
}
