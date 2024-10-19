import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  redirect,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import invariant from "tiny-invariant";
import { db } from "~/.server/db";
import { companies } from "~/.server/db/schema/companies";
import {
  deliveryOrderHeaders,
  deliveryOrderItems,
  deliveryOrders,
} from "~/.server/db/schema/delivery-orders";
import EditItems from "./EditItems";
import { setAllValues } from "~/.server/utils/setAllValues";
import EditHeaders from "./EditHeaders";
import {
  checkObjectPermissions,
  checkRoutePermissions,
} from "~/.server/utils/permissions";
import { z } from "zod";
import EditCompany from "./EditCompany";
import EditButtons from "./EditButtons";
import { authenticator } from "~/.server/auth";
import { createOrEditDeliveryOrder } from "./EditAction";

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
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const formData = await request.formData();

  // How did you get here?
  invariant(params.doId, "Missing Parameter doId");

  return await createOrEditDeliveryOrder(formData, Number(params.doId), user);
}

export default function DeliveryOrderDetail() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <div className="max-w-4xl mx-auto">
        <Form method="post">
          <div className="mt-24">
            <EditButtons />
            <div className="flex justify-between gap-16 mt-4">
              <EditCompany company={data.company} />
              <EditHeaders
                invNumber={data.deliveryOrder.id}
                date={data.deliveryOrder.date}
                headers={data.headers}
              />
            </div>
            <h2 className="text-xl mt-4">Items</h2>
            <EditItems items={data.items} />
          </div>
        </Form>
      </div>
    </>
  );
}
