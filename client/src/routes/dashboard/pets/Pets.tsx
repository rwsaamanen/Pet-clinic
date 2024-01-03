import { useEffect, useState } from "react";
import { Separator } from "../../../components/ui/separator";
import { Search } from "lucide-react";
import { capitalize } from "../../../components/shared/Capitalize";
import { formatDate } from "../../../components/shared/FormatTime";

interface Pet {
  _id: string;
  name: string;
  dob: Date;
  status: string;
  petType: string;
}

export function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPets = pets.filter(pet => {
    const petName = pet.name.toLowerCase();
    const petStatus = pet.status.toLowerCase();
    const petType = pet.petType.toLowerCase();
    const standardPetDOB = formatDate(pet.dob);
    const zeroOmittedPetDOB = generateSearchableDate(pet.dob);

    const searchLower = searchQuery.toLowerCase();

    return petName.includes(searchLower) ||
      petStatus.includes(searchLower) ||
      petType.includes(searchLower) ||
      standardPetDOB.toLowerCase().includes(searchLower) ||
      zeroOmittedPetDOB.includes(searchLower);
  });

  function generateSearchableDate(dateInput: Date): string {
    const date = new Date(dateInput);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  useEffect(() => {
    const fetchPets = async () => {
      try {

        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:5000/api/pets', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (Array.isArray(data)) {
          setPets(data);
        } else {
          console.error('Data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };

    fetchPets();
  }, []);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-5xl pb-12 px-4 text-primary w-full">
        <div id="welcome" className="mt-10">
          <h1 className="text-7xl font-medium leading-tight text-center">
            <span className="block">Pets</span>
          </h1>
        </div>

        <Separator />

        <div className="md:flex flex-col md:mr-4 mt-10">
          <div className="md:w-full justify-between items-center">
            <p className="font-semibold text-lg">Pets</p>
            <p className="tracking-tight text-neutral-500 mb-2">A list of pets currently on the database</p>
            <div className="flex items-center w-full rounded-lg p-2 bg-white border shadow-lg md:w-2/3">
              <div className="flex-shrink-0 pl-2 pr-3">
                <Search size={16} className="text-muted-foreground/70" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full focus:outline-none bg-white text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

            </div>
          </div>
        </div>

        <div className="px-6 font-sans lg:py-0 border rounded-lg bg-white shadow-lg mt-8 cursor-default text-sm text-neutral-500">
          <div className="p-2">
            <table className="w-full border-collapse text-left">
              <thead className=" border-slate-300/10 last:border-none">
                <tr>
                  <th className="py-6 pr-8 text-sm font-semibold">
                    Name
                  </th>
                  <th className="py-6 pr-8 text-sm font-semibold">
                    Date of Birth
                  </th>
                  <th className="hidden py-6 pr-8 text-sm font-semibold lg:table-cell">
                    Status
                  </th>
                  <th className="hidden py-6 pr-8 text-sm font-semibold lg:table-cell">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPets.map((pet, index) => (
                  <tr key={pet._id}>
                    <td className={`py-6 pr-8 hover:text-black cursor-pointer ${index !== pets.length - 1 ? 'border-b' : ''}`}>{capitalize(pet.name)}</td>
                    <td className={`py-6 pr-8 ${index !== pets.length - 1 ? 'border-b' : ''}`}>{formatDate(pet.dob)}</td>
                    <td className={`hidden py-6 pr-8 lg:table-cell ${index !== pets.length - 1 ? 'border-b' : ''}`}>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium leading-5 text-white ${pet.status.toLowerCase() === 'deceased' ? 'bg-red-500/90' : 'bg-green-500/90'}`}>
                        {capitalize(pet.status)}
                      </span>
                    </td>
                    <td className={`hidden py-6 pr-8 lg:table-cell ${index !== pets.length - 1 ? 'border-b' : ''}`}>{capitalize(pet.petType)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pets;
