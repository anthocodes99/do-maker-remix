import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DeliveryOrder = {
  id: number;
  date: string;
  companyName: string;
  isPosted: boolean;
  createdBy: string;
  createdAt: string;
};

export const columns: ColumnDef<DeliveryOrder>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "isPosted",
    header: "Posted",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "companyName",
    header: "Company Name",
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const deliveryOrder = row.original;
      return <Link to={`/delivery-order/${deliveryOrder.id}`}>Details</Link>;
    },
  },
];
