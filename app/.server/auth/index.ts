import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "~/.server/session";
import { FormStrategy } from "remix-auth-form";

import { users } from "../db/schema/users";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { encrypt } from "./encrypt";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

type User = typeof users.$inferSelect;

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage);

const login = async (username: string, password: string) => {
  // throw new Error("test");
  const rows = await db()
    .select()
    .from(users)
    .where(eq(users.username, username));

  // user does not exist
  if (!rows) {
    throw new Error("Invalid username or password.");
  }

  const user = rows[0];
  // invalid password
  if (encrypt(password) !== user.password) {
    throw new Error("Invalid username or password.");
  }

  return user;
};
// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get("username");
    const password = form.get("password");

    const userSelectSchema = createSelectSchema(users, {
      username: z.string().min(8).max(128),
      password: z.string().min(8).max(128),
    }).pick({
      username: true,
      password: true,
    });

    const result = userSelectSchema.safeParse({ username, password });
    // TODO: better error message handling
    //       i'm having a hard time sending zod's errors up
    if (!result.success) {
      throw new AuthorizationError(
        `Invalid username or password.`,
        result.error.flatten()
      );
      // throw {
      //   errors: result.error.flatten(),
      //   error: new AuthorizationError("Invalid access"),
      // };
    }

    // // You can validate the inputs however you want
    // invariant(typeof username === "string", "username must be a string");
    // invariant(username.length > 0, "username must not be empty");

    // invariant(typeof password === "string", "password must be a string");
    // invariant(password.length > 0, "password must not be empty");

    console.log("loggin in...");
    const user = await login(username, password);
    // the type of this user must match the type you pass to the Authenticator
    // the strategy will automatically inherit the type if you instantiate
    // directly inside the `use` method
    return user;
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  "user-pass"
);
