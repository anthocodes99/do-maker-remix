import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams, Link } from "@remix-run/react";
import { eq } from "drizzle-orm";
import invariant from "tiny-invariant";
import { db } from "~/.server/db";
import { companies } from "~/.server/db/schema/companies";
import {
  deliveryOrderHeaders,
  deliveryOrderItems,
  deliveryOrders,
} from "~/.server/db/schema/delivery-orders";

import { Pencil } from "lucide-react";
import { Button } from "~/components/ui/button";
import React from "react";
import { DataTable } from "../delivery-order._index/data-table";
import { columns } from "./columns";

export const handle = {
  breadcrumb: () => {
    const params = useParams();
    return (
      <>
        <h3 className="text-2xl font-bold">/</h3>
        <Link to={`/delivery-order`}>
          <h3 className="text-2xl font-bold">Delivery Order</h3>
        </Link>
        <h3 className="text-2xl font-bold">/</h3>
        <Link to={`/delivery-order/${params.doId}`}>
          <h3 className="text-2xl font-bold">{params.doId}</h3>
        </Link>
      </>
    );
  },
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.doId, "Missing deliveryOrderId parameter");
  const drizzle = db();

  const doRows = await drizzle
    .select()
    .from(deliveryOrders)
    .where(eq(deliveryOrders.id, Number(params.doId)));

  if (doRows.length !== 1) {
    throw new Response("Not found", { status: 404 });
  }

  const companyRows = await drizzle
    .select()
    .from(companies)
    .where(eq(companies.id, doRows[0].companyId));

  const headerRows = await drizzle
    .select()
    .from(deliveryOrderHeaders)
    .where(eq(deliveryOrderHeaders.deliveryOrderId, doRows[0].id));

  console.log(headerRows);

  const doItemRows = await drizzle
    .select()
    .from(deliveryOrderItems)
    .where(eq(deliveryOrderItems.deliveryOrderId, doRows[0].id));

  // add starting number
  const updDoItemRows = doItemRows.map((item, idx) => ({
    number: idx + 1,
    ...item,
  }));

  return {
    deliveryOrder: doRows[0],
    company: companyRows[0],
    headers: headerRows,
    items: updDoItemRows,
  };
};

export default function DeliveryOrderDetail() {
  const data = useLoaderData<typeof loader>();
  const params = useParams();
  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="mt-24">
          <div className="flex justify-end">
            <Button asChild variant="default" className="">
              <Link to={`/delivery-order/${params.doId}/edit`} className="">
                <Pencil /> <span className="pl-4 font-bold">Edit</span>
              </Link>
            </Button>
          </div>
          <div className="flex justify-between gap-16 mt-4">
            <div>
              <h1 className="text-2xl font-bold">{data.company?.name}</h1>
              <div className="mt-2">
                <p>{data.company?.addressLineOne}</p>
                <p>{data.company?.addressLineTwo}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 min-w-24 mt-2">
              <div>No. </div>
              <div>
                :{" "}
                {data.deliveryOrder.id.toLocaleString("en-US", {
                  minimumIntegerDigits: 5,
                  useGrouping: false,
                })}
              </div>
              <div>Date</div>
              <div>: {data.deliveryOrder.date}</div>
              {data.headers.map((header) => (
                <React.Fragment key={header.id}>
                  <div className="pr-8">{header.header}</div>
                  <div>: {header.value}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="mt-24 border border-gray-400"></div>
          <h2 className="text-xl mt-4">Items</h2>
        </div>
        <DataTable columns={columns} data={data.items}></DataTable>
      </div>
    </>
  );
}
