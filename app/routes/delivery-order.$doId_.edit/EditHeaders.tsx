import React, { useState } from "react";
import { Input } from "~/components/ui/input";

import { type loader } from "./route";
import { SerializeFrom } from "@remix-run/node";

type LoaderData = Awaited<ReturnType<typeof loader>>;

export default function EditHeaders({
  data,
}: {
  data: SerializeFrom<LoaderData>;
}) {
  const [headers, setHeaders] = useState(data.headers);

  const handleChange = (id: number, header: string, value: string) => {
    // const currHeader = headers.find((header) => header.id === id);
    const updHeader = { id, createdAt: null, createdBy: 1, header, value };
    const newHeaders = [
      ...headers.filter((header) => header.id !== id),
      updHeader,
    ];
    setHeaders(newHeaders as SerializeFrom<LoaderData["headers"]>);
  };
  return (
    <div className="grid grid-cols-2 max-w-96 mt-2 items-center">
      {/* INV Number */}
      <input type="hidden" name="headers" value={JSON.stringify(headers)} />
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
          type="date"
          defaultValue={data.deliveryOrder.date}
        />
      </div>
      {data.headers.map((header) => (
        <React.Fragment key={header.id}>
          <div className="pr-8">
            <Input
              type="text"
              defaultValue={header.header}
              // TODO: refactor unncessary update
              onChange={(e) =>
                handleChange(header.id, e.target.value, header.value)
              }
            />
          </div>
          <div className="flex gap-2">
            <span>:</span>
            <Input
              type="text"
              defaultValue={header.value}
              // TODO: refactor unncessary update
              onChange={(e) =>
                handleChange(header.id, header.header, e.target.value)
              }
            />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
