import axios from 'axios';
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Separator } from "../../../components/ui/separator";
import { formatDate } from "../../../components/shared/FormatTime";

interface Pet {
    _id: string;
    name: string;
}

interface Visit {
    _id: string;
    petId: Pet;
    date: string;
    comment: string;
    petName?: string;
}

export function Visits() {
    const [upcomingVisits, setUpcomingVisits] = useState<Visit[]>([]);
    const [pastVisits, setPastVisits] = useState<Visit[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Authentication token not found.');
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/visits', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                let visitsData: Visit[] = response.data;

                visitsData = await Promise.all(visitsData.map(async (visit: Visit) => {

                    if (visit.petId && typeof visit.petId === 'string') {
                        try {
                            const petResponse = await axios.get(`http://localhost:5000/api/pets/${visit.petId}`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
                            });
                            return { ...visit, petName: petResponse.data.name };
                        } catch (error) {
                            console.error('Error fetching pet data:', error);

                            return { ...visit, petName: 'Unknown Pet' };
                        }
                    } else {

                        return { ...visit, petName: 'Unknown Pet' };
                    }
                }));

                const now = new Date();
                const upcoming = visitsData.filter(visit => new Date(visit.date) > now)
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                const past = visitsData.filter(visit => new Date(visit.date) <= now)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setUpcomingVisits(upcoming);
                setPastVisits(past);
            } catch (error) {
                console.error('Error fetching visits:', error);
            }
        };

        fetchVisits();
    }, []);

    const useSearchFilter = (
        data: Visit[],
        searchQuery: string,
        filterCallback: (item: Visit, query: string) => boolean
    ) => {
        return data.filter(item => filterCallback(item, searchQuery));
    };

    const normalizeDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString();
        const month = (date.getMonth() + 1).toString();

        const withLeadingZeros = `${day.padStart(2, '0')}.${month.padStart(2, '0')}`;
        const withoutLeadingZeros = `${parseInt(day)}.${parseInt(month)}`;

        return { withLeadingZeros, withoutLeadingZeros };
    };

    const filteredVisits = useSearchFilter(upcomingVisits.concat(pastVisits), searchQuery, (visit, query) => {
        const lowerCaseQuery = query.toLowerCase();
        const petNameMatch = visit.petId.name.toLowerCase().includes(lowerCaseQuery);
        const { withLeadingZeros, withoutLeadingZeros } = normalizeDate(visit.date);
        const dateMatch = withLeadingZeros.includes(lowerCaseQuery) || withoutLeadingZeros.includes(lowerCaseQuery);

        return petNameMatch || dateMatch;
    });


    const now = new Date();
    const filteredUpcomingVisits = filteredVisits.filter(visit => new Date(visit.date) > now);
    const filteredPastVisits = filteredVisits.filter(visit => new Date(visit.date) <= now);

    return (
        <div className="w-full">
            <div className="mx-auto max-w-5xl pb-12 px-4 text-primary w-full">
                <div id="welcome" className="mt-10">
                    <h1 className="text-7xl font-medium leading-tight text-center">
                        <span className="block">Visits</span>
                    </h1>
                </div>

                <Separator />

                <div className="md:flex md:flex-cols-2 md:mr-4 mt-10">
                    <div className="md:w-1/2">
                        <p className="font-semibold text-lg px-2">Visits</p>
                        <p className="tracking-tight text-neutral-500 mb-2 px-2">A list of visits currently on the database</p>
                        <div className="flex items-center w-full rounded-lg p-2 bg-white border shadow-lg">
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


                <div className="grid md:grid-cols-2 gap-4 grid-cols-1 mt-8">
                    <div>
                        <h2 className="text-lg font-semibold mb-4 px-2">Upcoming Visits</h2>
                        <div className="px-6 font-sans border rounded-lg bg-white shadow-lg cursor-default text-sm text-black">
                            <table className="w-full border-collapse text-left">
                                <thead className="border-slate-300/10">
                                    <tr>
                                        <th className="py-6 pr-8 text-sm font-semibold">Name</th>
                                        <th className="py-6 pr-8 text-sm font-semibold">Visit</th>
                                    </tr>
                                </thead>
                                <tbody className="text-neutral-600">
                                    {filteredUpcomingVisits.map((visit) => (
                                        <tr key={visit._id}>
                                            <td className="py-6 pr-8 text-sm font-semibold">
                                                {visit.petId.name}
                                            </td>
                                            <td className="py-6 pr-8 text-sm font-semibold">
                                                {formatDate(visit.date)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-4 px-2">Past Visits</h2>
                        <div className="px-6 font-sans border rounded-lg bg-white shadow-lg cursor-default text-sm text-black">
                            <table className="w-full border-collapse text-left">
                                <thead className="border-slate-300/10">
                                    <tr>
                                        <th className="py-6 pr-8 text-sm font-semibold">Name</th>
                                        <th className="py-6 pr-8 text-sm font-semibold">Visit</th>
                                    </tr>
                                </thead>
                                <tbody className="text-neutral-600">
                                    {filteredPastVisits.map((visit) => (
                                        <tr key={visit._id}>
                                            <td className="py-6 pr-8 text-sm font-semibold">
                                                {visit.petId.name}
                                            </td>
                                            <td className="py-6 pr-8 text-sm font-semibold">
                                                {formatDate(visit.date)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Visits;
