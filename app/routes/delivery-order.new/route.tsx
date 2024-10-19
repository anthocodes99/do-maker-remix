import { Form, Link, useLoaderData } from "@remix-run/react";
import CreateUpdateButtons from "../../components/delivery-order/CreateUpdateButtons";
import NewCompany from "./NewCompany";
import CreateUpdateHeaders from "../../components/delivery-order/CreateUpdateHeaders";
import CreateUpdateItems from "~/components/delivery-order/CreateUpdateItems";
import { db } from "~/.server/db";
import { authenticator } from "~/.server/auth";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { companies } from "~/.server/db/schema/companies";
import { eq } from "drizzle-orm";
import { createOrEditDeliveryOrder } from "../delivery-order.$doId_.edit/EditAction";

export const handle = {
  breadcrumb: () => {
    return (
      <>
        <h3 className="text-2xl font-bold">/</h3>
        <Link to={`/delivery-order`}>
          <h3 className="text-2xl font-bold">Delivery Order</h3>
        </Link>
        <h3 className="text-2xl font-bold">/</h3>
        <h3 className="text-2xl font-bold">{"NEW"}</h3>
      </>
    );
  },
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const formData = await request.formData();

  return await createOrEditDeliveryOrder(formData, null, user, true);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const drizzle = db();

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const companiesRows = await drizzle
    .select()
    .from(companies)
    .where(eq(companies.createdBy, user.id));

  return {
    companies: companiesRows,
  };
};

export default function DeliveryOrderDetail() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <div className="max-w-4xl mx-auto">
        <Form method="post">
          <div className="mt-24">
            <CreateUpdateButtons />
            <div className="flex justify-between gap-16 mt-4">
              {/* <EditCompany company={data.company} /> */}
              <NewCompany companies={data.companies} />
              <CreateUpdateHeaders invNumber={null} date={null} headers={[]} />
            </div>
            <h2 className="text-xl mt-4">Items</h2>
            <CreateUpdateItems items={[]} />
          </div>
        </Form>
      </div>
    </>
  );
}
