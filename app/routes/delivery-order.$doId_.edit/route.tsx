import { CheckIcon } from "@radix-ui/react-icons";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useParams } from "@remix-run/react";
import { eq } from "drizzle-orm";
import React from "react";
import invariant from "tiny-invariant";
import { db } from "~/.server/db";
import { companies } from "~/.server/db/schema/companies";
import {
  deliveryOrderHeaders,
  deliveryOrderItems,
  deliveryOrders,
} from "~/.server/db/schema/delivery-orders";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import EditItems from "./EditItems";
import { setAllValues } from "~/.server/utils/setAllValues";
import EditHeaders from "./EditHeaders";

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
          <h3 className="text-2xl font-bold">{`${params.doId} (edit)`}</h3>
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

  const doItemRows = await drizzle
    .select()
    .from(deliveryOrderItems)
    .where(eq(deliveryOrderItems.deliveryOrderId, doRows[0].id));

  return {
    deliveryOrder: doRows[0],
    company: companyRows[0],
    headers: headerRows,
    items: doItemRows,
  };
};

export async function action({ params, request }: ActionFunctionArgs) {
  type LoaderData = Awaited<ReturnType<typeof loader>>;
  // FIXME: id can be null in this case
  type Items = LoaderData["items"];

  const formData = await request.formData();
  console.log(formData); // FormData {junks:value}

  // How did you get here?
  invariant(params.doId, "Missing Parameter doId");
  console.log(params); // doId: 1

  // ==== handling headers ====

  // ==== handling items ====
  // check if items exists
  invariant(formData.get("items"), "Missing items.");

  const items: Items = JSON.parse(formData.get("items") as string);
  console.log(items);

  const updItems = [];

  for (const item of items) {
    // check deliveryOrderId tampering
    if (item.deliveryOrderId !== Number(params.doId))
      throw new Response("Invalid doId.", { status: 403 });

    // check createdBy tampering
    // FIXME: update when auth backend is done
    if (item.createdBy !== 1)
      throw new Response("Invalid user.", { status: 403 });

    // NOTE: update this whenever a new row is inserted
    // we need updItem because some business logic are
    // required before inserting into db, such as assigning
    // createdBy to current auth'd user, and not allowing
    // upserts to createdAt
    const updItem = {
      id: item.id,
      name: item.name,
      // FIXME: update when auth backend is done
      createdBy: item.createdBy ?? 1,
      deliveryOrderId: item.deliveryOrderId,
      quantity: item.quantity,
      uom: item.uom,
      description: item.description,
    };

    updItems.push(updItem);
  }

  // TODO: check user authenticity
  // TODO: zod check items
  const returns = await db()
    .insert(deliveryOrderItems)
    .values(updItems)
    .onConflictDoUpdate({
      target: deliveryOrderItems.id,
      set: setAllValues(updItems),
    })
    .returning({ insertedId: deliveryOrderItems.id });
  console.log("items ok!", returns);

  throw new Response("I suck", { status: 501 });
}

export default function DeliveryOrderDetail() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <div className="max-w-4xl mx-auto">
        <Form method="post">
          <div className="mt-24">
            <div className="flex justify-end">
              {/* BUTTONS SECTION */}
              <Button variant="success" type="submit">
                <div className="flex items-center">
                  <CheckIcon /> <span className="pl-4 font-bold">Post</span>
                </div>
              </Button>
            </div>
            <div className="flex justify-between gap-16 mt-4">
              {/* COMPANY SECTION */}
              <div>
                <h1 className="text-2xl font-bold">{data.company.name}</h1>
                <div className="mt-2">
                  <p>{data.company.addressLineOne}</p>
                  <p>{data.company.addressLineTwo}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 min-w-24 mt-2">
              <EditHeaders data={data} />
            </div>
            <h2 className="text-xl mt-4">Items</h2>
            <EditItems items={data.items} />
          </div>
        </Form>
      </div>
    </>
  );
}
