import { useState } from "react";
import { FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Item } from "./item";

interface DocumentListProps {

}

export const DocumentList = ({

}: DocumentListProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId]
    }));
  };


    return (
      <>
      </>
    );
};
