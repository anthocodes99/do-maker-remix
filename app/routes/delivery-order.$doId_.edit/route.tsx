import { CheckIcon, Cross1Icon, Cross2Icon } from "@radix-ui/react-icons";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { eq } from "drizzle-orm";
import invariant from "tiny-invariant";
import { db } from "~/.server/db";
import { companies } from "~/.server/db/schema/companies";
import {
  deliveryOrderHeaders,
  deliveryOrderItems,
  deliveryOrders,
} from "~/.server/db/schema/delivery-orders";
import { Button } from "~/components/ui/button";
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
  type Items = LoaderData["items"];
  type Headers = LoaderData["headers"];
  // FIXME: id can be null in this case

  const formData = await request.formData();
  console.log(formData); // FormData {junks:value}

  // How did you get here?
  invariant(params.doId, "Missing Parameter doId");
  // console.log(params); // doId: 1

  // ==== handling headers ====
  invariant(formData.get("headers"), "Missing headers.");

  const headers: Headers = JSON.parse(formData.get("headers") as string);

  const dbHeaders = await db()
    .select()
    .from(deliveryOrderHeaders)
    .where(eq(deliveryOrderHeaders.id, Number(params.doId)));

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

  for (const header of headers) {
    // check deliveryOrderId tampering
    if (header.deliveryOrderId !== Number(params.doId))
      throw new Response("Invalid doId.", { status: 403 });

    // check createdBy tampering
    // FIXME: update when auth backend is done
    if (header.createdBy !== 1)
      throw new Response("Invalid user.", { status: 403 });

    // FIXME: better vodoo magic casting ability
    const updHeader = {
      createdBy: 1,
      // createdAt: , // no need to touch this
      deliveryOrderId: Number(params.doId), // prevent tampering
      header: header.header,
      value: header.value,
    };

    if (header.id !== null) {
      updHeader.id = header.id;
    }

    updHeaders.push(updHeader as Headers[number]);
  }

  // TODO: check user authenticity
  // TODO: zod check items
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

  // ==== handling items ====
  // check if items exists
  invariant(formData.get("items"), "Missing items.");

  const items: Items = JSON.parse(formData.get("items") as string);
  // console.log(items);

  const updItems = [];

  // how to delete items?
  // we need to know that the item doesn't exist anymore
  // so we need to fetch data first
  const dbItems = await db()
    .select()
    .from(deliveryOrderItems)
    .where(eq(deliveryOrderItems.deliveryOrderId, Number(params.doId)));

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
      name: item.name,
      // FIXME: update when auth backend is done
      createdBy: item.createdBy === null ? 1 : item.createdBy,
      deliveryOrderId: item.deliveryOrderId,
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

  return redirect(`/delivery-order/${params.doId}`);
  // throw new Response("I suck", { status: 501 });
}

export default function DeliveryOrderDetail() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  return (
    <>
      <div className="max-w-4xl mx-auto">
        <Form method="post">
          <div className="mt-24">
            <div className="flex gap-2 justify-end">
              {/* BUTTONS SECTION */}
              <Button variant="success" type="submit">
                <div className="flex items-center">
                  <CheckIcon /> <span className="pl-4 font-bold">Post</span>
                </div>
              </Button>
              <Button
                variant="destructive"
                type="button"
                onClick={() => navigate(-1)}
              >
                <div className="flex items-center">
                  <Cross1Icon /> <span className="pl-4 font-bold">Cancel</span>
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
