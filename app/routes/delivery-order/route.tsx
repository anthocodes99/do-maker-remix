import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/.server/auth";
import Navbar from "~/components/Navbar";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return { user };
}

export default function DeliveryOrder() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div>
      <Navbar user={user} />
      <Outlet></Outlet>
    </div>
  );
}
