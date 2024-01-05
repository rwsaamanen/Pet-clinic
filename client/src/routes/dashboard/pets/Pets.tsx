import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "../../../components/ui/separator";
import { capitalize } from "../../../components/shared/Capitalize";
import { formatDate } from "../../../components/shared/FormatDate";
import { Search } from "lucide-react";

interface Pet {
  _id: string;
  name: string;
  dob: Date;
  status: string;
  petType: string;
}

// Pets

const Pets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Filtering the list of pets based on the search query.
  // Lowercasing all pet attributes for case-insensitive search.
  // Formatting date of birth for searchability.

  const filteredPets = pets.filter(pet => {
    const petName = pet.name.toLowerCase();
    const petStatus = pet.status.toLowerCase();
    const petType = pet.petType.toLowerCase();
    const standardPetDOB = formatDate(pet.dob);
    const zeroOmittedPetDOB = generateSearchableDate(pet.dob);

    const searchLower = searchQuery.toLowerCase();

    // Returns true if pets that match any of the search criteria.

    return petName.includes(searchLower) ||
      petStatus.includes(searchLower) ||
      petType.includes(searchLower) ||
      standardPetDOB.toLowerCase().includes(searchLower) ||
      zeroOmittedPetDOB.includes(searchLower);
  });

  // Function to generate a searchable date string.

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
        if (!token) {
          console.error('Authentication token not found.');
          return;
        }
  
        // Determining the user's role to fetch appropriate pets data. i.e. Doctor can see all pets and owners only own pets.

        const userRole = JSON.parse(localStorage.getItem('userDetails') || '{}').role;
  
        let url = '';
        if (userRole === 'pet_owner') {
          url = 'http://localhost:5000/api/pets/owner';
        } else if (userRole === 'doctor') {
          url = 'http://localhost:5000/api/pets';
        }
  
        if (url) {
          const response = await axios.get(url, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
  
          const data = response.data;
  
          if (Array.isArray(data)) {
            setPets(data);
          } else {
            console.error('Data is not an array:', data);
          }
        } else {
          console.error('URL not defined for user role.');
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };
  
    fetchPets();
  }, []);

  // Function to redirect to a specific pet's detail page.

  const onRedirect = (petId: string) => {
    const pet = pets.find(p => p._id === petId);
    if (pet) {
      navigate(`/dashboard/pets/${petId}`, { state: { pet } });
    }
  };

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

        <div className="text-black px-6 font-sans lg:py-0 border rounded-lg bg-white shadow-lg mt-8 cursor-default text-sm">
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
              <tbody className='text-neutral-600 font-semibold'>
                {filteredPets.map((pet) => (
                  <tr key={pet._id}>
                    <td onClick={() => onRedirect(pet._id)} className='py-6 pr-8 hover:text-black hover:underline cursor-pointer'>{capitalize(pet.name)}</td>
                    <td className='py-6 pr-8'>{formatDate(pet.dob)}</td>
                    <td className='hidden py-6 pr-8 lg:table-cell'>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium leading-5 text-white ${pet.status.toLowerCase() === 'deceased' ? 'bg-red-500/90' : 'bg-green-500/90'}`}>
                        {capitalize(pet.status)}
                      </span>
                    </td>
                    <td className='hidden py-6 pr-8 lg:table-cell'>{capitalize(pet.petType)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pets;
