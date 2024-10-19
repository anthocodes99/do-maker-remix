import { redirect } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import invariant from "tiny-invariant";
import { z } from "zod";
import { db } from "~/.server/db";
import {
  deliveryOrderHeaders,
  deliveryOrderItems,
  deliveryOrders,
  type DeliveryOrder,
} from "~/.server/db/schema/delivery-orders";
import {
  checkObjectPermissions,
  checkRoutePermissions,
} from "~/.server/utils/permissions";
import { setAllValues } from "~/.server/utils/setAllValues";

import { type loader } from "./route";
import { type User } from "~/.server/db/schema/users";
import { ActionFunctionArgs } from "@remix-run/node";
import { companies } from "~/.server/db/schema/companies";

type LoaderData = Awaited<ReturnType<typeof loader>>;
type Items = LoaderData["items"];
type Headers = LoaderData["headers"];

type AuthUser = Omit<User, "password">;

async function handleDate(date: string, doId: number, user: AuthUser) {
  // ==== handling date ====
  const dbDeliveryOrder = await db()
    .select()
    .from(deliveryOrders)
    .where(eq(deliveryOrders.id, doId));

  // check authenticity
  checkObjectPermissions(dbDeliveryOrder[0], user);

  // const doInsertSchema = createInsertSchema(deliveryOrders, {
  //   id: (schema) => schema.id.positive(),
  //   date: z.string(),
  // });
  const updDeliveryOrder = {
    id: dbDeliveryOrder[0].id,
    date: date as string,
    companyId: dbDeliveryOrder[0].companyId,
    createdBy: dbDeliveryOrder[0].createdBy,
  };

  console.log(updDeliveryOrder);
  const doReturn = await db()
    .insert(deliveryOrders)
    .values([updDeliveryOrder])
    .onConflictDoUpdate({
      target: deliveryOrders.id,
      set: setAllValues([updDeliveryOrder]),
    })
    .returning({ insertedId: deliveryOrders.id });
  console.log("invoice ok!", doReturn);
}

async function handleHeaders(headers: Headers, doId: number, user: AuthUser) {
  const dbHeaders = await db()
    .select()
    .from(deliveryOrderHeaders)
    .where(eq(deliveryOrderHeaders.id, doId));

  for (const dbHeader of dbHeaders) {
    const compareResult = headers.find((header) => header.id === dbHeader.id);
    // if does not exist
    if (!compareResult) {
      // delete from db
      // TODO: refactor to use bulk edits or transactions
      const returns = await db()
        .delete(deliveryOrderHeaders)
        .where(eq(deliveryOrderHeaders.id, dbHeader.id))
        .returning({ deletedId: deliveryOrderHeaders.id });
      console.log(`deliveryOrderHeaders deleted: `, returns);
    }
  }

  const updHeaders: Headers = [];
  const headerInsertSchema = createInsertSchema(deliveryOrderHeaders, {
    id: (schema) => schema.id.positive(),
    createdAt: z.string(),
  });

  // skips if no length
  if (headers.length === 0) return;

  for (const header of headers) {
    // https://orm.drizzle.team/docs/zod

    checkRoutePermissions(header.deliveryOrderId, doId);

    // check createdBy tampering
    // FIXME: update when auth backend is done
    checkObjectPermissions(header, user);

    try {
      headerInsertSchema.parse(header);
    } catch (e) {
      // FIXME: upgrade error reporting
      if (e instanceof z.ZodError) {
        throw new Response(e.message, { status: 400 });
      }
    }

    // FIXME: better vodoo magic casting ability (type engineering)
    const updHeader = {
      createdBy: 1,
      // createdAt: , // no need to touch this
      deliveryOrderId: doId, // prevent tampering
      header: header.header,
      value: header.value,
      position: header.position,
    };

    if (header.id !== null) {
      updHeader.id = header.id;
    }

    updHeaders.push(updHeader as Headers[number]);
  }

  const headersReturns = await db()
    .insert(deliveryOrderHeaders)
    .values(updHeaders)
    .onConflictDoUpdate({
      target: deliveryOrderHeaders.id,
      set: setAllValues(updHeaders),
    })
    .returning({ insertedId: deliveryOrderHeaders.id });
  console.log("headers ok!", headersReturns);
  console.log("headers", updHeaders);
}

async function handleItems(items: Items, doId: number, user: AuthUser) {
  const updItems = [];
  const itemInsertSchema = createInsertSchema(deliveryOrderItems, {
    id: (schema) => schema.id.positive().nullable(),
    deliveryOrderId: z.number().nullable(),
    createdAt: z.string(),
  });

  // how to delete items?
  // we need to know that the item doesn't exist anymore
  // so we need to fetch data first
  const dbItems = await db()
    .select()
    .from(deliveryOrderItems)
    .where(eq(deliveryOrderItems.deliveryOrderId, doId));

  console.log(dbItems);

  // then we compare
  // compare to prepare for delete
  for (const dbItem of dbItems) {
    const compareResult = items.find((item) => item.id === dbItem.id);
    // if does not exist
    if (!compareResult) {
      // delete from db
      // TODO: refactor to use bulk edits or transactions
      const returns = await db()
        .delete(deliveryOrderItems)
        .where(eq(deliveryOrderItems.id, dbItem.id))
        .returning({ deletedId: deliveryOrderItems.id });
      console.log(`deliveryOrderItems deleted: `, returns);
    }
  }

  // skips if no items
  if (items.length === 0) return;

  for (const item of items) {
    // FIXME: disabled route permission due to new items
    // checkRoutePermissions(item.deliveryOrderId, doId);

    // check createdBy tampering
    // FIXME: update when auth backend is done
    checkObjectPermissions(item, user);

    try {
      itemInsertSchema.parse(item);
    } catch (e) {
      // FIXME: upgrade error reporting
      if (e instanceof z.ZodError) {
        throw new Response(e.message, { status: 400 });
      }
    }

    // NOTE: update this whenever a new row is inserted
    // we need updItem because some business logic are
    // required before inserting into db, such as assigning
    // createdBy to current auth'd user, and not allowing
    // upserts to createdAt
    const updItem = {
      name: item.name,
      // FIXME: update when auth backend is done
      createdBy: item.createdBy === null ? 1 : item.createdBy,
      // FIXME: i could be the source of a auth bypass
      deliveryOrderId:
        item.deliveryOrderId === null ? doId : Number(item.deliveryOrderId),
      quantity: item.quantity,
      uom: item.uom,
      description: item.description,
      position: item.position,
    };
    if (item.id !== null) {
      // FIXME: refactor to fix ts error
      updItem.id = item.id;
    }

    updItems.push(updItem);
  }

  const returns = await db()
    .insert(deliveryOrderItems)
    .values(updItems)
    .onConflictDoUpdate({
      target: deliveryOrderItems.id,
      set: setAllValues(updItems),
    })
    .returning({ insertedId: deliveryOrderItems.id });
  console.log("items ok!", returns);
}

/**
 * Set `newDeliveryOrder` to `true` **AND** `doId` to `null` to create new
 * delivery order
 * @param formData
 * @param doId
 * @param newDeliveryOrder
 * @returns
 */
export async function createOrEditDeliveryOrder(
  formData: Awaited<ReturnType<ActionFunctionArgs["request"]["formData"]>>,
  doId: number | null,
  user: AuthUser,
  newDeliveryOrder = false
) {
  // create a new delivery order
  if (doId === null && newDeliveryOrder) {
    const companyForm: FormDataEntryValue | null = formData.get("company_name");

    const companyRows = await db()
      .select()
      .from(companies)
      .where(eq(companies.name, companyForm as string));

    if (companyRows.length === 0)
      throw new Response("Invalid company name.", { status: 400 });

    const dateForm: FormDataEntryValue | null = formData.get("header_date");

    // TODO: throw response instead
    invariant(dateForm, "Invalid date");

    checkObjectPermissions(companyRows[0], user);

    const data = {
      date: dateForm as string,
      companyId: companyRows[0].id,
      createdBy: user.id,
      createdAt: new Date(),
    };
    const response = await db()
      .insert(deliveryOrders)
      .values([data])
      .returning({ id: deliveryOrders.id });
    console.log(response);
    doId = response[0].id;
    invariant(doId, "Invalid newly created deliveryOrder.id");
  } else {
    // === update existing delivery order ===
    // to prevent doId = true && newDeliveryOrder = true | null | undefined
    invariant(doId, "Invalid delivery id");

    // === date ===
    const date: FormDataEntryValue | null = formData.get("header_date");
    invariant(date, "Missing date.");
    await handleDate(date as string, doId, user);
  }

  // === headers ===
  console.log("headers!");
  const headers: Headers = JSON.parse(formData.get("headers") as string);
  invariant(headers, "Missing headers.");
  await handleHeaders(headers, doId, user);

  /// === items ===
  console.log("items!");
  // FIXME: the TYPES ARE WRONG
  // JSON.parse will turn it into A STRING!
  const items: Items = JSON.parse(formData.get("items") as string);
  invariant(items, "Missing items.");
  await handleItems(items, doId, user);

  return redirect(`/delivery-order/${doId}`);
}
