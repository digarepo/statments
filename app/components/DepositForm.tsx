import { useFetcher } from "@remix-run/react";

export default function DepositForm({ deposit }: { deposit?: any }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" className="grid gap-2 p-4 border rounded">
      <input name="id" defaultValue={deposit?.dp_id || ""} placeholder="Deposit ID" className="border p-2" required />
      <input name="amount" type="number" step="0.01" defaultValue={deposit?.amount || ""} placeholder="Amount" className="border p-2" required />
      <input name="deposit_date" type="date" defaultValue={deposit?.deposit_date ? deposit.deposit_date.split(" ")[0] : ""} className="border p-2" required />
      <input name="owner_name" defaultValue={deposit?.owner_name || ""} placeholder="Owner Name" className="border p-2" />
      <input name="depositor_name" defaultValue={deposit?.depositor_name || ""} placeholder="Depositor Name" className="border p-2" />
      <input name="reconciliation" defaultValue={deposit?.reconciliation || ""} placeholder="Reconciliation" className="border p-2" />
      <input name="ref_number" defaultValue={deposit?.ref_number || ""} placeholder="Reference Number" className="border p-2" />
      <input name="deposit_number" defaultValue={deposit?.deposit_number || ""} placeholder="Deposit Number" className="border p-2" />
      <input name="bank_name" defaultValue={deposit?.bank_name || ""} placeholder="Bank Name" className="border p-2" />
      <input name="account_type" defaultValue={deposit?.account_type || ""} placeholder="Account Type" className="border p-2" />
      <textarea name="comment" defaultValue={deposit?.comment || ""} placeholder="Comment" className="border p-2"></textarea>

      <input type="hidden" name="old_id" value={deposit?.dp_id || ""} />
      <div className="flex gap-2">
        <button type="submit" name="intent" value={deposit ? "update" : "create"} className="bg-blue-500 text-white p-2 rounded">
          {deposit ? "Update" : "Create"}
        </button>
        {deposit && (
          <button type="submit" name="intent" value="delete" className="bg-red-500 text-white p-2 rounded">
            Delete
          </button>
        )}
      </div>
    </fetcher.Form>
  );
}
