import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Dog,
    Cat,
} from "lucide-react";
import { Separator } from '../../../components/ui/separator';
import { useVisit } from '../../../hooks/use-visit'

const PetDetails = () => {
    const location = useLocation();
    const pet = location.state?.pet;
    const visit = useVisit();

    const [isEditing, setIsEditing] = useState(false);
    const [editedPet, setEditedPet] = useState(pet);
    const [newComment, setNewComment] = useState('');

    if (!pet) {
        return <div>Pet not found.</div>;
    }

    useEffect(() => {
        setEditedPet(pet);
    }, [pet]);

    const handleEditToggle = () => {
        if (isEditing) {
            
            if (newComment.trim() !== '') {
                setEditedPet({
                    ...editedPet,
                    comments: [...(editedPet.comments || []), newComment]
                });
            }
            setEditedPet(pet);
            setNewComment('');
        }
        setIsEditing(!isEditing);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditedPet({ ...editedPet, name: event.target.value });
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setEditedPet({ ...editedPet, status: event.target.value });
    };

    const getPetIcon = (petType: string) => {
        switch (petType) {
            case 'dog':
                return <Dog className="inline-block mr-2" size={24} />;
            case 'cat':
                return <Cat className="inline-block mr-2" size={24} />;
            default:
                return null;
        }
    };

    const calculateAge = (dateString: string): number => {
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const capitalizeFirstLetter = (string: string): string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    };

    const openAddVisitModal = () => {
        visit.onOpen(editedPet);
      };

    return (
        <div className="w-full">
            <div className="mx-auto max-w-5xl pb-12 px-4 text-primary w-full">
                <div className="mt-10">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedPet.name}
                            onChange={handleNameChange}
                            className="text-7xl font-medium leading-tight text-left border-gray-300 border rounded w-full"
                        />
                    ) : (
                        <h2 className="text-7xl font-medium leading-tight text-left">
                            {editedPet.name}
                        </h2>
                    )}
                </div>
                <Separator />
                <h1 className='mt-6 text-lg tracking-tight text-neutral-500'>Pet details</h1>
                <div className='border border-neutral-300 bg-white shadow-lg rounded-md p-5'>
                    <div className="flex justify-end gap-24">
                        <div><p>Upcoming Visits</p></div>
                        <div><p>Past Visits</p></div>
                    </div>
                    {getPetIcon(editedPet.petType)}
                    <div className="mt-2">
                        {isEditing ? (
                            <select
                                value={editedPet.status}
                                onChange={handleStatusChange}
                                className="border text-gray-900"
                            >
                                <option value="alive">Alive</option>
                                <option value="deceased">Deceased</option>
                            </select>
                        ) : (
                            <p className={`text-gray-900 ${editedPet.status === 'deceased' ? 'line-through' : ''}`}>
                                {capitalizeFirstLetter(editedPet.status)}
                            </p>
                        )}
                        <p className="text-gray-900">{calculateAge(editedPet.dob)} years old</p>
                        <p className="text-gray-900">{formatDate(pet.dob)}</p>
                    </div>
                </div>
                <div className='flex items-center mt-4 justify-end gap-x-2'>
                    <button onClick={openAddVisitModal} className="rounded-md px-3.5 py-2.5 text-sm font-semibold dark:text-white hover:shadow-sm hover:bg-neutral-200/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950">
                        Add a Visit
                    </button>
                    <button className="rounded-md bg-neutral-800 px-3.5 py-2.5 text-sm font-semibold text-white dark:text-white shadow-sm hover:bg-neutral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950">
                        Edit Details
                    </button>
                </div>
                <h1 className='mt-10'>Remarks</h1>
            </div>
        </div>
    );
};

export default PetDetails;
