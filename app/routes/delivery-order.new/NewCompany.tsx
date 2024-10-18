import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Combobox,
  ComboboxInput,
  ComboboxItem,
  ComboboxListBox,
  ComboboxPopover,
} from "~/components/ui/combobox";

import { FieldGroup } from "~/components/ui/field";

import { type Company } from "~/.server/db/schema/companies";
import { SerializeFrom } from "@remix-run/node";

export default function ComboboxDemo({
  companies,
}: {
  companies: SerializeFrom<Company[]>;
}) {
  const [selectedCompany, setSelectedCompany] = React.useState("");
  function handleSelectChange(value: string) {
    setSelectedCompany(value);
    console.log(selectedCompany);
  }
  return (
    <div className="block">
      <Combobox inputValue={selectedCompany} onInputChange={handleSelectChange}>
        <FieldGroup className="p-0">
          <ComboboxInput className="text-2xl font-bold" />
          <Button variant="ghost" size="icon" className="mr-1 size-6 p-1">
            <ChevronsUpDown aria-hidden="true" className="size-4 opacity-50" />
          </Button>
        </FieldGroup>
        <ComboboxPopover>
          <ComboboxListBox>
            {companies.map((company) => (
              <ComboboxItem key={company.id} textValue={company.name}>
                {company.name}
              </ComboboxItem>
            ))}
          </ComboboxListBox>
        </ComboboxPopover>
      </Combobox>
      <div className="mt-4">
        <p>
          {
            companies.find((company) => company.name === selectedCompany)
              ?.addressLineOne
          }
        </p>
        <p>
          {
            companies.find((company) => company.name === selectedCompany)
              ?.addressLineTwo
          }
        </p>
      </div>
    </div>
  );
}
