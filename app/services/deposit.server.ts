import { query } from "./db.server";

export async function getAllDeposits() {
  return query("SELECT * FROM deposits ORDER BY deposit_date DESC");
}

export async function createDeposit(data: any) {
  const { id, amount, formattedDate, ownerName, depositorName, reconciliation, refNumber, depositNumber, bankName, accountType, comment } = data;

  await query(
    `INSERT INTO deposits 
    (dp_id, amount, deposit_date, owner_name, depositor_name, reconciliation, ref_number, deposit_number, bank_name, account_type, comment) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, amount, formattedDate, ownerName, depositorName, reconciliation, refNumber, depositNumber, bankName, accountType, comment]
  );
}

export async function updateDeposit(data: any) {
  const { id, amount, formattedDate, ownerName, depositorName, reconciliation, refNumber, depositNumber, bankName, accountType, comment, old_id } = data;

  await query(
    `UPDATE deposits SET 
    dp_id = ?, amount = ?, deposit_date = ?, owner_name = ?, depositor_name = ?, reconciliation = ?, ref_number = ?, deposit_number = ?, bank_name = ?, account_type = ?, comment = ?
    WHERE dp_id = ?`,
    [id, amount, formattedDate, ownerName, depositorName, reconciliation, refNumber, depositNumber, bankName, accountType, comment, old_id]
  );
}

export async function deleteDeposit(id: string) {
  await query("DELETE FROM deposits WHERE dp_id = ?", [id]);
}
