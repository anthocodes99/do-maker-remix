import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import { AuthorizationError } from "remix-auth";
import { authenticator } from "~/.server/auth";
import { commitSession, getSession } from "~/.server/session";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export async function action({ context, request }: ActionFunctionArgs) {
  console.log("Login");
  await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    // throwOnError: true,
    failureRedirect: "/login",
    context, // optional
  });
  // try {
  //   await authenticator.authenticate("user-pass", request, {
  //     successRedirect: "/",
  //     throwOnError: true,
  //     context, // optional
  //   });
  //   return redirect("/");
  // } catch (error) {
  //   console.log({ error });
  //   if (error instanceof AuthorizationError) {
  //     return json({ errors: error });
  //   }
  //   return json({ errors: { error: "something went wrong" } });
  // }
}

// Finally, we can export a loader function where we check if the user is
// authenticated with `authenticator.isAuthenticated` and redirect to the
// dashboard if it is or return null if it's not
export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
  const session = await getSession(request.headers.get("cookie"));
  const error = session.get(authenticator.sessionErrorKey) as Error[] | Error;
  if (error) {
    return json(
      {
        error,
      },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
        status: 401,
      }
    );
  } else {
    return {};
  }
}

export default function Login() {
  // const actionData = useActionData<typeof action>();
  // console.log({ actionData });
  const loader = useLoaderData<typeof loader>();
  console.log({ loader });
  return (
    <div className="max-w-md mx-auto mt-24">
      <Form method="post">
        <p className="mb-4 text-red-500">
          {loader.error?.message ? loader.error.message : ""}
        </p>
        <Input type="text" name="username" placeholder="Username" />
        {/* {actionData?.errors.username ? (
          <em>{actionData?.errors.username}</em>
        ) : null} */}
        <div className="mt-4">
          <Input type="password" name="password" placeholder="Password" />
          {/* {actionData?.errors.password ? (
            <em>{actionData?.errors.password}</em>
          ) : null} */}
        </div>
        <div className="flex mt-8 justify-center">
          <Button variant="default">Login</Button>
        </div>
      </Form>
    </div>
  );
}
