import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export default function EditButtons() {
  const navigate = useNavigate();
  return (
    <div className="flex gap-2 justify-end">
      {/* BUTTONS SECTION */}
      <Button variant="success" type="submit">
        <div className="flex items-center">
          <CheckIcon /> <span className="pl-4 font-bold">Post</span>
        </div>
      </Button>
      <Button variant="destructive" type="button" onClick={() => navigate(-1)}>
        <div className="flex items-center">
          <Cross1Icon /> <span className="pl-4 font-bold">Cancel</span>
        </div>
      </Button>
    </div>
  );
}
