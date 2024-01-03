import { useEffect, useState } from "react";
import { FileIcon } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Item } from "./item";
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
  PawPrint,
  MapPin,
  Home,
  Dog,
  Cat,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Pet {
  _id: string;
  ownerId: string;
  name: string;
  petType: 'dog' | 'cat';
  status: 'alive' | 'deceased';
  dob: Date;
}

interface PetListProps {
  level?: number;
  showPetsInitially?: boolean;
}

export const PetList = ({ level = 0, showPetsInitially = false }: PetListProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [petList, setPetList] = useState<string[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const navigate = useNavigate();

  const onExpand = () => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      allPets: !prevExpanded.allPets,
    }));
  };

  useEffect(() => {
    console.log('Fetching pets...');

    const fetchPets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Authentication token not found.');
          return;
        }

        console.log('Token found:', token);

        const response = await axios.get("http://localhost:5000/api/pets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const petData = response.data;
        console.log("API Response:", petData);

        if (Array.isArray(petData)) {
          const petNames = petData.map((pet) => pet.name);
          setPets(petData);
          setPetList(petNames);
        } else {
          console.error("Invalid pet data:", petData);
        }
      } catch (error: any) {
        console.error("Error fetching pets:", error);
        if (error.response) {
          console.error("Error details:", error.response);
        }
      };
    }

    fetchPets();
  }, [showPetsInitially]);


  const onRedirect = (petId: string) => {
    const pet = pets.find(p => p._id === petId);
    if (pet) {
      navigate(`/dashboard/pets/${petId}`, { state: { pet } });
    }
  };

  console.log("AAAAA" + petList)


  return (
    <>
      <div>
        <Item
          id="pets"
          onClick={() => navigate("/dashboard/pets")}
          label="Pets"
          icon={PawPrint}
          level={level}
          onExpand={onExpand}
          expanded={expanded.allPets}
          petList={petList}
        />
        {expanded.allPets && (
          <div>
            {pets.map((pet) => (
              <div key={pet._id}>
                <Item
                  id={pet._id}
                  onClick={() => onRedirect(pet._id)}
                  label={pet.name}
                  icon={pet.petType === 'dog' ? Dog : Cat}
                  level={level + 1}
                  petList={petList}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};