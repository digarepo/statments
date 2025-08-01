import { useFetcher } from "@remix-run/react";

export default function Form() {
  const fetcher = useFetcher();

  return (
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
      <button type="submit" name="intent" value="create" className="col-span-2 bg-blue-500 text-white p-2 rounded">
        Create
      </button>
    </fetcher.Form>
  );
}
