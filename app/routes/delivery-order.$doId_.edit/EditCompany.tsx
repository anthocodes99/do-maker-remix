import { SerializeFrom } from "@remix-run/node";
import { companies } from "~/.server/db/schema/companies";

type Company = SerializeFrom<typeof companies.$inferSelect>;

export default function EditCompany({ company }: { company: Company }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">{company.name}</h1>
      <div className="mt-2">
        <p>{company.addressLineOne}</p>
        <p>{company.addressLineTwo}</p>
      </div>
    </div>
  );
}
