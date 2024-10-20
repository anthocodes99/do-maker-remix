import { Input } from "~/components/ui/input";
import { type loader } from "~/routes/delivery-order.$doId_.edit/route";
import { SerializeFrom } from "@remix-run/node";
import { useEffect, useRef, useState } from "react";

import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { useParams } from "@remix-run/react";

import { type DeliveryOrderItem } from "~/.server/db/schema/delivery-orders";

// type safe (db changes will reflect)
// type LoaderData = Awaited<ReturnType<typeof loader>>;
// type Items = LoaderData["items"];
// type Item = Items extends Array<infer T> ? T : never;

type Item = Omit<DeliveryOrderItem, "id"> & {
  id: number | null;
  new: boolean;
};

// https://stackoverflow.com/questions/78712510/
export default function EditItems(props: { items: SerializeFrom<Item[]> }) {
  const params = useParams();
  const [items, setItems] = useState([...props.items]);

  const inputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const handleChange = (
    position: number,
    field: keyof Item,
    value: string | number
  ) => {
    const currItem = items.find((item) => item.position === position);
    const updItem = { ...currItem, [field]: value };
    const newItems = [
      ...items.filter((item) => item.position !== position),
      updItem,
    ]
      .sort((a, b) => a.position! - b.position!)
      .map((item) => {
        if (item.new) {
          const { new: _, ...rest } = item;
          return rest;
        }
        return item;
      });
    // updItem ulimately refers from props.items, which *always* have data
    // TypeScript can't seem to infer, so I gave it a lil help
    setItems(newItems as SerializeFrom<Item[]>);
  };

  // wip - does not work due to id needing to be null
  const addItem = (focus: boolean = true) => {
    // TODO: generate default value based on model?
    const newItem = {
      // FIXME: (ts) id needs to be number | null
      id: null,
      name: "",
      createdAt: null,
      // FIXME: implement once auth layer is done
      createdBy: 1,
      deliveryOrderId: Number(params.doId!),
      quantity: 0,
      position: items.length,
      uom: "EA",
      description: null,
      new: true,
    };
    const updItems = [...items, newItem];
    setItems(updItems);

    // focus on the newly created item after it has been rendered
    setTimeout(() => {
      inputRefs.current[items.length]?.focus();
    }, 0); // Short delay to wait for render
  };

  const deleteItem = (pos: number) => {
    const updItems = items.filter((item) => item.position !== pos);
    setItems(updItems);
  };

  useEffect(() => {
    if (items.length === 0) {
      addItem(false);
    }
  });
  return (
    <>
      <ul id="items" className="mt-8">
        <input name="items" type="hidden" value={JSON.stringify(items)} />
        {items.map((item, index) => (
          <li key={item.position} className="mt-4">
            <div className="flex justify-between gap-1">
              <Input
                // name={`items_name_${item.id}`}
                type="text"
                defaultValue={item.name}
                onChange={(e) =>
                  handleChange(item.position, "name", e.target.value)
                }
                ref={(el) => (inputRefs.current[index] = el)}
              />
              <div className="flex gap-1">
                <Input
                  // name={`items_quantity_${item.id}`}
                  type="number"
                  defaultValue={item.quantity}
                  onChange={(e) =>
                    handleChange(item.position, "quantity", e.target.value)
                  }
                />
                <Input
                  // name={`items_uom_${item.id}`}
                  type="text"
                  defaultValue={item.uom}
                  onChange={(e) =>
                    handleChange(item.position, "uom", e.target.value)
                  }
                />
              </div>
              <Button
                variant="destructive"
                type="button"
                className="ml-2"
                onClick={() => deleteItem(item.position)}
              >
                <TrashIcon />
              </Button>
            </div>
            <div className="mt-2">
              <Input
                // name={`items_description_${item.id}`}
                type="text"
                defaultValue={item.description ?? ""}
                placeholder="Description"
              />
            </div>
          </li>
        ))}
      </ul>
      <Button
        variant="default"
        className="mt-4"
        type="button"
        onClick={() => addItem()}
      >
        <PlusIcon />
        <span className="ml-2">Add Item</span>
      </Button>
    </>
  );
}
