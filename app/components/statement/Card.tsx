import { useFetcher } from "@remix-run/react";
import { format } from "date-fns";

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

export default function Card({ deposit }: { deposit: Deposit }) {
  const fetcher = useFetcher();

  return (
    <div className="p-4 border rounded">
      <fetcher.Form method="post" className="grid grid-cols-2 gap-2">
        <input name="id" defaultValue={deposit.dp_id} className="p-2 border" required />
        <input name="amount" type="number" step="0.01" defaultValue={deposit.amount} className="p-2 border" required />
        <input name="date" type="date" defaultValue={deposit.deposit_date ? format(new Date(deposit.deposit_date), "yyyy-MM-dd") : ""} className="p-2 border" required />
        <input name="owner_name" defaultValue={deposit.owner_name} className="p-2 border" />
        <input name="depositor_name" defaultValue={deposit.depositor_name} className="p-2 border" />
        <input name="reconciliation" defaultValue={deposit.reconciliation} className="p-2 border" />
        <input name="ref_number" defaultValue={deposit.ref_number} className="p-2 border" />
        <input name="deposit_number" defaultValue={deposit.deposit_number} className="p-2 border" />
        <input name="bank_name" defaultValue={deposit.bank_name} className="p-2 border" />
        <input name="account_type" defaultValue={deposit.account_type} className="p-2 border" />
        <textarea name="comment" defaultValue={deposit.comment} className="col-span-2 p-2 border"></textarea>
        <input type="hidden" name="old_id" value={deposit.dp_id} />
        <div className="col-span-2 flex gap-2">
          <button type="submit" name="intent" value="update" className="bg-green-500 text-white p-2 rounded flex-1">Update</button>
          <button type="submit" name="intent" value="delete" className="bg-red-500 text-white p-2 rounded flex-1">Delete</button>
        </div>
      </fetcher.Form>
    </div>
  );
}
