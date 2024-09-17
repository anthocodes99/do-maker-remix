import { ColumnDef } from "@tanstack/react-table";

// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "~/components/ui/dropdown-menu";

// import { DotsHorizontalIcon } from "@radix-ui/react-icons";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DeliveryOrderItem = {
  number: number;
  id: number;
  name: string;
  quantity: string;
  uom: string;
};

export const columns: ColumnDef<DeliveryOrderItem>[] = [
  {
    accessorKey: "number",
    header: "#",
    size: 40,
  },
  {
    accessorKey: "id",
    header: "CODE",
    size: 40,
  },
  {
    accessorKey: "name",
    header: "DESCRIPTION",
  },
  {
    accessorKey: "quantity",
    header: "QTY",
    size: 40,
    // TODO: align center
  },
  {
    accessorKey: "uom",
    header: "UOM",
    size: 40,
    // TODO: align center
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   header: "Actions",
  //   size: 0,
  //   cell: () => {
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <DotsHorizontalIcon className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(payment.id)}
  //           >
  //             Copy payment ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>Edit</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
