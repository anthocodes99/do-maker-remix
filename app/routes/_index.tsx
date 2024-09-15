import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/.server/db";
import { companies } from "~/.server/db/schema/companies";

import {
  Card,
  // CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const meta: MetaFunction = () => {
  return [
    { title: "DO Maker" },
    { name: "description", content: "Delivery Order Maker!" },
  ];
};

export const loader = async () => {
  const rows = await db().select().from(companies);
  return {
    data: rows,
  };
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <>
      <main className="max-w-6xl mx-auto mt-12">
        <Link to="/delivery-order">
          <h1 className="text-2xl font-bold">Head to Delivery Order</h1>
        </Link>
        <section className="flex gap-4 mt-24">
          {data.map((company) => (
            <Link key={company.id} to={`/company/${company.id}`}>
              <Card>
                <CardHeader className="max-w-lg">
                  <CardTitle>{company.name}</CardTitle>
                  <CardDescription>{`${company.addressLineOne} ${company.addressLineTwo}`}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}
