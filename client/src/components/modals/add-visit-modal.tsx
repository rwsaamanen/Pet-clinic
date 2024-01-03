import {
    Dialog,
    DialogContent,
    DialogHeader
} from "../../components/ui/dialog";
import { useVisit } from "../../hooks/use-visit";
import { Label } from "../../components/ui/label";
import { useState } from "react";

export const AddVisitModal = () => {
    const [visitDate, setVisitDate] = useState('');

    const visit = useVisit();
    if (!visit.isOpen || !visit.pet) {
        return null;
    }

    const handleAddVisit = async () => {

        // Logs

        if (!visitDate) {
            console.log('Please select a date for the visit.');
            return;
        }
    
        if (!visit.pet) {
            console.error('No pet data available.');
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Authentication token not found.');
                return;
            }
    
            const response = await fetch('http://localhost:5000/api/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    petId: visit.pet._id,
                    date: visitDate,
                    comment: ''
                })
            });
    
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to add visit');
            }
    
            console.log('Visit added:', responseData);
            visit.onClose();
        } catch (error) {
            console.error('Error adding visit:', error);
        }
    };

    return (
        <Dialog open={visit.isOpen} onOpenChange={visit.onClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                    <h2 className="text-lg font-medium">
                        Add a Visit
                    </h2>
                </DialogHeader>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>Date</Label>
                        <input
                            type="date"
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                            className="text-muted-foreground p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                <button
                    onClick={handleAddVisit}
                    className="rounded-md px-3.5 py-2.5 text-sm font-semibold bg-neutral-950 text-white hover:shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950">
                    Add a Visit
                </button>
            </DialogContent>
        </Dialog>
    );
};
