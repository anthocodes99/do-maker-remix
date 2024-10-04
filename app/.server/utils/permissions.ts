import { users } from "../db/schema/users";

type DBObject = {
  createdBy: number;
  [key: string]: unknown;
};

type User = typeof users.$inferSelect;

export function checkObjectPermissions(obj: DBObject, user: User) {
  if (obj.createdBy !== user.id) {
    throw new Response("Invalid User!", { status: 403 });
  }
}

export function checkRoutePermissions(objId: number, paramId: number) {
  if (objId !== paramId) {
    throw new Response("Paramter conflict!", { status: 403 });
  }
}
