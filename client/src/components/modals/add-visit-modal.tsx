import axios from 'axios';
import { useState } from "react";
import { Label } from "../../components/ui/label";
import { useVisit } from "../../hooks/use-visit";
import {
    Dialog,
    DialogContent,
    DialogHeader
} from "../../components/ui/dialog";

// AddVisitModal

export const AddVisitModal = () => {
    const [visitDate, setVisitDate] = useState('');
    const [comment, setComment] = useState('');

    const visit = useVisit();
    if (!visit.isOpen || !visit.pet) {
        return null;
    }

    const handleAddVisit = async () => {

        if (!visitDate) {
            return;
        }

        if (!visit.pet) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Authentication token not found.');
                return;
            }

            const response = await axios.post('http://localhost:5000/api/visits', {
                petId: visit.pet._id,
                date: visitDate,
                comment: comment
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                const responseData = response.data;
                console.log('Visit added:', responseData);
                visit.onClose();
            } else {
                throw new Error(response.data.message || 'Failed to add visit');
            }
        } catch (error) {
            console.error('Error adding visit:', error);
        }
    };

    // Enable only for future appointments.

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const minDate = `${year}-${month}-${day}`;

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
                            min={minDate}
                            className="text-muted-foreground p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-y-1">
                    <Label>Add Additional Comments</Label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="text-muted-foreground p-2 border border-gray-300 rounded"
                    />
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
