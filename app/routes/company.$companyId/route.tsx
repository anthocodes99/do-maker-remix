import { Link, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { db } from "~/.server/db";
import { companies } from "~/.server/db/schema/companies";
import {
  deliveryOrders,
  deliveryOrderItems,
} from "~/.server/db/schema/delivery-orders";

import { DeliveryOrder, columns } from "../delivery-order._index/columns";
import { DataTable } from "../delivery-order._index/data-table";
import { users } from "~/.server/db/schema/users";
import { LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

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

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.companyId, "Missing deliveryOrderId parameter");
  // TODO: check for non-existing delivery order
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
    .where(eq(deliveryOrders.companyId, params.companyId))
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
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
