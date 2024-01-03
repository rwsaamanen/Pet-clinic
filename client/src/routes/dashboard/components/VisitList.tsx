import { useState } from "react";
import { FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Item } from "./item";
import {
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Visits = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const onExpand = (petId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [petId]: !prevExpanded[petId]
    }));
  };
 
  const handleNavigate = () => navigate('/dashboard/visits')

    return (
      <>
      <div>
      <Item label="Visits" icon={MapPin} onClick={handleNavigate}/>
        </div>
      </>
    );
};
