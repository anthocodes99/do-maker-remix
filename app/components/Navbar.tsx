import React from "react";
import { useMatches } from "@remix-run/react";

// TODO: use shadcn Breadcrumb
// https://ui.shadcn.com/docs/components/breadcrumb
export default function Navbar() {
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
      <p>antho</p>
    </div>
  );
}
