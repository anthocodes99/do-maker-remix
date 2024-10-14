import React from "react";
import { Form, useMatches } from "@remix-run/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import { User } from "~/.server/db/schema/users";
import { SerializeFrom } from "@remix-run/node";

// TODO: use shadcn Breadcrumb
// https://ui.shadcn.com/docs/components/breadcrumb
export default function Navbar({
  user,
}: {
  user: SerializeFrom<Omit<User, "password">>;
}) {
  const matches = useMatches();
  return (
    <div className="flex justify-between px-8 py-10 border border-b border-gray-400">
      <ul className="flex gap-4">
        {matches
          .filter((match) => match.handle && match.handle.breadcrumb)
          .map((match, index) => (
            // TODO: Refactor this?
            // I have to import react for this to work
            <React.Fragment key={index}>
              {match.handle.breadcrumb(match)}
            </React.Fragment>
          ))}
      </ul>
      <div className="flex gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex gap-2 cursor-pointer items-center">
              {user.username} <ChevronDown className="h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <Form action="/logout" method="post">
                <DropdownMenuItem className="cursor-pointer">
                  <button type="submit" className="flex">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </DropdownMenuItem>
              </Form>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
