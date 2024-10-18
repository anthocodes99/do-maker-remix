import { Link, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { db } from "~/.server/db";
import { companies } from "~/.server/db/schema/companies";
import { deliveryOrders } from "~/.server/db/schema/delivery-orders";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { users } from "~/.server/db/schema/users";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

export const handle = {
  breadcrumb: () => (
    <>
      <h3 className="text-2xl font-bold">/</h3>
      <Link to="/delivery-order">
        <h3 className="text-2xl font-bold">Delivery Order</h3>
      </Link>
    </>
  ),
};

export const loader = async () => {
  const rows = await db()
    .select({
      id: deliveryOrders.id,
      date: deliveryOrders.date,
      companyName: companies.name,
      isPosted: deliveryOrders.isPosted,
      createdBy: users.username,
      createdAt: deliveryOrders.createdAt,
    })
    .from(deliveryOrders)
    .leftJoin(companies, eq(deliveryOrders.companyId, companies.id))
    .leftJoin(users, eq(users.id, deliveryOrders.createdBy));
  return {
    data: rows,
  };
};

export default function DeliveryOrderList() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <>
      <div className="container mx-auto py-10">
        <div className="flex justify-end mb-4">
          <Link to="/delivery-order/new">
            <Button>
              <PlusIcon /> <span className="pl-2">New Invoice</span>
            </Button>
          </Link>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
