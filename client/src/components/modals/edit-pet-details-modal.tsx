import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { useEditDetails } from "../../hooks/use-pet-details";
import axios from "axios";

export const EditPetDetails = () => {
    const editDetails = useEditDetails();

    const [name, setName] = useState(editDetails.pet?.name || "");
    const [status, setStatus] = useState(editDetails.pet?.status || "Select Status");

    if (!editDetails.isOpen || !editDetails.pet) {
        return null;
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
    };

    const handleConfirm = async () => {
        if (!editDetails.pet) {
            console.error('Pet details not found');
            return;
        }
        try {
            const token = localStorage.getItem('token');
    
            const updatedName = name !== "" ? name : editDetails.pet.name;
            const updatedStatus = status !== "Select Status" ? status : editDetails.pet.status;
    
            const response = await axios.put(`http://localhost:5000/api/pets/${editDetails.pet._id}`, {
                name: updatedName,
                status: updatedStatus
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
    
            console.log('Update response:', response);
    
            editDetails.onClose();
        } catch (error) {
            console.error('Error updating pet:', error);
        }
    };

    const getStatusButtonClass = (buttonStatus: string) => {
        return `rounded-md px-2 py-1 text-sm font-semibold hover:bg-neutral-200 ${status === buttonStatus ? 'bg-gray-200 text-black' : 'text-gray-700'}`;
    };    

    return (
        <Dialog open={editDetails.isOpen} onOpenChange={editDetails.onClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                    <h2 className="text-lg font-medium">Edit Pet Details</h2>
                </DialogHeader>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <Label>Pet Details</Label>
                        <span className="mt-4">
                            <div className="flex items-center gap-x-4 mb-2">
                                <h2 className="font-semibold">Name</h2>
                                <input type="text" placeholder="Name" value={name} onChange={handleNameChange} className="border border-neutral-400 rounded-sm px-1" />
                            </div>
                            <div className="flex items-center gap-x-4">
                                <h2 className="font-semibold">Status</h2>
                                <div className="flex gap-x-2">
                                    <button onClick={() => handleStatusChange('Alive')} className={getStatusButtonClass('Alive')}>Alive</button>
                                    <button onClick={() => handleStatusChange('Deceased')} className={getStatusButtonClass('Deceased')}>Deceased</button>
                                    <button onClick={() => handleStatusChange('Missing')} className={getStatusButtonClass('Missing')}>Missing</button>
                                    <button onClick={() => handleStatusChange('Other')} className={getStatusButtonClass('Other')}>Other</button>
                                </div>
                            </div>
                        </span>
                    </div>
                </div>
                <button onClick={handleConfirm} className="rounded-md px-3.5 py-2.5 text-sm font-semibold bg-neutral-950 text-white hover:shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950">Confirm</button>
            </DialogContent>
        </Dialog>
    );
};
