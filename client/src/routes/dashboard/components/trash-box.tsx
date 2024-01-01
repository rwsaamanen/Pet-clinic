import { useState } from "react";
import { Search, Trash, Undo } from "lucide-react";


import { Input } from "../../../components/ui/input";

export const TrashBox = () => {

  const [search, setSearch] = useState("");


  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found.
        </p>
      </div>
    </div>
  );
};
