import Card from "./Card";

export default function List({ deposits }: { deposits: any[] }) {
  return (
    <div className="space-y-4">
      {deposits.map((d) => (
        <Card key={d.dp_id} deposit={d} />
      ))}
    </div>
  );
}
