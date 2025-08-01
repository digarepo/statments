import { json, type LoaderFunction, type ActionFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllDeposits, createDeposit, updateDeposit, deleteDeposit } from "~/services/deposit.server";
import StatementForm from "~/components/statement/Form";
import StatementList from "~/components/statement/List";

export const loader: LoaderFunction = async () => {
  const deposits = await getAllDeposits();
  return json(deposits);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  const payload = {
    id: String(formData.get("id")),
    amount: Number(formData.get("amount")),
    date: String(formData.get("date")),
    ownerName: String(formData.get("owner_name")),
    depositorName: String(formData.get("depositor_name")),
    reconciliation: String(formData.get("reconciliation")),
    refNumber: String(formData.get("ref_number")),
    depositNumber: String(formData.get("deposit_number")),
    bankName: String(formData.get("bank_name")),
    accountType: String(formData.get("account_type")),
    comment: String(formData.get("comment")),
    old_id: String(formData.get("old_id")),
    formattedDate: new Date(String(formData.get("date"))).toISOString().slice(0, 19).replace("T", " ")
  };

  if (intent === "create") await createDeposit(payload);
  if (intent === "update") await updateDeposit(payload);
  if (intent === "delete") await deleteDeposit(payload.id);

  return json({ ok: true });
};

export default function DepositsPage() {
  const deposits = useLoaderData<typeof loader>();
  return (
    <div className="max-w-4xl mx-auto p-4">
      <StatementForm />
      <StatementList deposits={deposits} />
    </div>
  );
}
