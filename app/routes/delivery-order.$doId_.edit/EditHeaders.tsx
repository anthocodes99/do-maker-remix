import React, { useState } from "react";
import { Input } from "~/components/ui/input";

import { type loader } from "./route";
import { SerializeFrom } from "@remix-run/node";

type LoaderData = Awaited<ReturnType<typeof loader>>;

export default function EditHeaders(props: {
  invNumber: number | null;
  date: string | null;
  headers: SerializeFrom<LoaderData["headers"]>;
}) {
  // there's two types of headers
  // deliveryOrder headers (inv no and date)
  // and custom headers (key-value pairs)
  // { invNumber: int, date: string, headers}
  const [headers, setHeaders] = useState(props.headers);

  const handleChange = (
    id: number,
    field: keyof LoaderData["headers"][number],
    value: string
  ) => {
    // const currHeader = headers.find((header) => header.id === id);
    const currHeader = headers.find((header) => header.id === id);
    const updHeader = { ...currHeader, [field]: value };
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
        {props.invNumber !== null
          ? props.invNumber.toLocaleString("en-US", {
              minimumIntegerDigits: 5,
              useGrouping: false,
            })
          : "NEW"}
      </div>
      {/* DATE */}
      <div>Date</div>
      <div className="flex gap-2">
        <span>:</span>
        <Input name={`header_date`} type="date" defaultValue={props.date} />
      </div>
      {headers.map((header) => (
        <React.Fragment key={header.id}>
          <div className="pr-8">
            <Input
              type="text"
              defaultValue={header.header}
              onChange={(e) =>
                handleChange(header.id, "header", e.target.value)
              }
            />
          </div>
          <div className="flex gap-2">
            <span>:</span>
            <Input
              type="text"
              defaultValue={header.value}
              onChange={(e) => handleChange(header.id, "value", e.target.value)}
            />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
