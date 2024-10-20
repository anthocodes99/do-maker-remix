import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { eq } from "drizzle-orm";
import invariant from "tiny-invariant";
import { authenticator } from "~/.server/auth";
import { db } from "~/.server/db";
import {
  deliveryOrderHeaders,
  deliveryOrderItems,
  deliveryOrders,
} from "~/.server/db/schema/delivery-orders";
import { checkObjectPermissions } from "~/.server/utils/permissions";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  // How did you get here?
  invariant(params.doId, "Missing Parameter doId");

  const drizzle = db();
  const doRows = await drizzle
    .select()
    .from(deliveryOrders)
    .where(eq(deliveryOrders.id, Number(params.doId)));

  if (doRows.length === 0) {
    throw new Response("Not found", { status: 404 });
  }

  checkObjectPermissions(doRows[0], user);
  await drizzle.transaction(async (tx) => {
    await tx
      .delete(deliveryOrderItems)
      .where(eq(deliveryOrderItems.deliveryOrderId, doRows[0].id));
    await tx
      .delete(deliveryOrderHeaders)
      .where(eq(deliveryOrderHeaders.deliveryOrderId, doRows[0].id));
    await tx.delete(deliveryOrders).where(eq(deliveryOrders.id, doRows[0].id));
  });

  return redirect("/delivery-order/");
};

export const loader = () => {
  throw new Response("Method not allowed", { status: 405 });
};
