import React from "react";
import { Input } from "~/components/ui/input";

import { type loader } from "./route";
import { SerializeFrom } from "@remix-run/node";

type LoaderData = Awaited<ReturnType<typeof loader>>;

export default function EditHeaders({
  data,
}: {
  data: SerializeFrom<LoaderData>;
}) {
  return (
    <div className="grid grid-cols-2 min-w-24 mt-2">
      {/* HEADERS SECTION */}
      {/* INV Number */}
      <input type="hidden" value={"heyyyyy"} />
      <div>No. </div>
      <div>
        :{" "}
        {data.deliveryOrder.id.toLocaleString("en-US", {
          minimumIntegerDigits: 5,
          useGrouping: false,
        })}
      </div>
      {/* DATE */}
      <div>Date</div>
      <div className="flex gap-2">
        <span>:</span>
        <Input
          name={`header_date`}
          type="text"
          defaultValue={data.deliveryOrder.date}
        />
      </div>
      {data.headers.map((header) => (
        <React.Fragment key={header.id}>
          <div className="pr-8">
            <Input
              name={`header_${header.id}`}
              type="text"
              defaultValue={header.header}
            />
          </div>
          <div className="flex gap-2">
            <span>:</span>
            <Input
              name={`header_value_${header.id}`}
              defaultValue={header.value}
            />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
