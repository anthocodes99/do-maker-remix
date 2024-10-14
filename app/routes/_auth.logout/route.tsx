import { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/.server/auth";

export async function action({ request }: ActionFunctionArgs) {
  console.log("im called!");
  await authenticator.logout(request, { redirectTo: "/login" });
}
