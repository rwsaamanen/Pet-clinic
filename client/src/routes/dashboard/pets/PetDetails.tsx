import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Separator } from '../../../components/ui/separator';
import { Editor } from '../../../components/shared/Editor';
import { useVisit } from '../../../hooks/use-visit'
import { useEditDetails } from '../../../hooks/use-pet-details'
import {
    Dog,
    Cat,
} from "lucide-react";

interface CommentAuthor {
    name: string;
    role: string;
}

interface Comment {
    _id: string;
    petId: {
        _id: string;
    };
    content: string;
    createdAt: string;
    author: CommentAuthor;
    isPublic: boolean;
}

interface CommentsState {
    publicComments: Comment[];
    doctorComments: Comment[];
}

interface Visit {
    _id: string;
    petId: {
        _id: string;
        name: string;
    };
    date: string;
    comment: string;
}

interface VisitComment {
    _id: string;
    visitId: string;
    comment: string;
}

// PetDetails { This file needs heavy refactoring TODO }

const PetDetails = () => {
    const location = useLocation();
    const pet = location.state?.pet;
    const [upcomingVisits, setUpcomingVisits] = useState<Visit[]>([]);
    const [pastVisits, setPastVisits] = useState<Visit[]>([]);
    const visit = useVisit();
    const editDetails = useEditDetails();
    const [editedPet, setEditedPet] = useState(pet);
    const [showEditor, setShowEditor] = useState(false);
    const [editorContent, setEditorContent] = useState('');
    const [comments, setComments] = useState<CommentsState>({ publicComments: [], doctorComments: [] });
    const allComments: Comment[] = [...comments.publicComments, ...comments.doctorComments];
    const [visitComments, setVisitComments] = useState<VisitComment[]>([]);
    const editorRef = useRef<HTMLDivElement>(null);

    if (!pet) {
        return <div>Pet not found.</div>;
    }

    useEffect(() => {

        // Checking if pet data is present and has an ID.

        if (pet && pet._id) {
            setEditedPet(pet);
            fetchVisitsForPet(pet._id);
            fetchComments();
        }
    }, [pet]); // Dependency array with 'pet' to run the effect when 'pet' changes. Navigating to this page should always trigger this.

    // fetchVisitsForPet

    const fetchVisitsForPet = async (petId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/visits', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            // Extracting all visits from the response.

            const allVisits: Visit[] = response.data;

            // Filtering visits that match the current pet's ID.

            const matchingVisits = filterVisitsByPetId(allVisits, petId);

            // Extracting comments from the matching visits.

            const comments = matchingVisits
                .filter((visit) => visit.comment !== '')
                .map((visit) => ({
                    _id: visit._id,
                    visitId: visit._id,
                    comment: visit.comment
                }));

            // Setting the comments related to the visits.

            setVisitComments(comments);

            // Categorizing visits into upcoming and past.

            categorizeVisits(matchingVisits);
        } catch (error) {
            console.error('Error fetching visits:', error);
        }
    };

    // filterVisitsByPetId

    const filterVisitsByPetId = (visits: Visit[], petId: string) => {
        return visits.filter(visit => visit.petId._id === petId);
    };

    // categorizeVisits i.e. categorize visits into upcoming and past based on the current date.

    const categorizeVisits = (visits: Visit[]) => {
        const now = new Date();

        const upcoming = visits
            .filter(visit => new Date(visit.date) > now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const past = visits
            .filter(visit => new Date(visit.date) <= now)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setUpcomingVisits(upcoming);
        setPastVisits(past);
    };

    // getPetIcon

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

    // calculateAge i.e. Calculate the age of a pet based on its birth date.

    const calculateAge = (dateString: string): number => {
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();

        // Checks if we need to adjust the age based on the month and day.

        const monthDifference = today.getMonth() - birthDate.getMonth();

        // Decreasing the age by 1 if the pet hasn't reached its birthday yet this year.

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate()))
            age--;

        return age;
    };

    // Following functions could potentially be in separate utility file. TODO

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

    const openEditPetDetailsModal = () => {
        editDetails.onOpen(pet);
    };

    const handleAddRemarkClick = () => {
        setShowEditor(!showEditor);
    };

    // Click outside remark container to hide.

    const handleClickOutside = (event: MouseEvent) => {
        if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
            setShowEditor(false);
        }
    };

    // useEffect to manage adding and removing an event listener for detecting clicks outside an element.

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup function to remove the event listener when the component is unmounted.

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Event handlers.

    const handleEditorContentChange = (content: string) => {
        setEditorContent(content);
    };

    const handleMedicalNoteClick = async () => {
        await sendComment(editorContent, 'doctor');
    };

    const handlePublicRemarkClick = async () => {
        await sendComment(editorContent, 'public');
    };

    // sendComment

    const sendComment = async (content: string, type: 'doctor' | 'public') => {

        // Validating the comment content to ensure it's not empty.

        if (!content || content.trim() === '') {
            console.error('Error: Comment content is empty');
            return;
        }

        // Determining if the comment is public based on the type.

        const isPublic = type === 'public';

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/pets/comment', {
                petId: editedPet._id,
                content: content,
                isPublic: isPublic
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error sending comment:', error);
            if (axios.isAxiosError(error)) {
                console.error('Response data:', error.response?.data);
            }
        }
    };

    // fetchComments

    const fetchComments = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Authentication token not found.');
            return;
        }

        // Get comments.

        try {
            const response = await axios.get(`http://localhost:5000/api/pets/${pet._id}/comments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setComments(response.data);
        } catch (error: any) {
            console.error('Error fetching comments:', error);
            if (error.response) {
                console.error("Error details:", error.response);
            }
        }
    };

    // Formats

    const formatDateCustom = (date: Date) => {
        const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
        const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        return `${day}.${month}.${year}`;
    };

    const formatTimeCustom = (date: Date) => {
        const hours = new Date(date).getHours().toString().padStart(2, '0');
        const minutes = new Date(date).getMinutes().toString().padStart(2, '0');
        return `${hours}.${minutes}`;
    };

    // handleRemoveComment

    const handleRemoveComment = async (petId: string, commentId: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Authentication token not found.');
            return;
        }

        try {

            // Making a DELETE request to remove a specific comment.
            // The request URL includes both the commentId and petId.

            const response = await axios.delete(`http://localhost:5000/api/pets/comments/${commentId}/${petId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Better catch. TODO

        } catch (error) {
            console.error('Error removing comment:', error);
        }
    };

    const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');

    // Checking if the current user is a doctor based on the role specified in user details.

    const isDoctor = userDetails && userDetails.role === 'doctor';

    // Filtering comments based on the user's role. i.e. If doctor, acces all comments. Otherwise only public comments.

    const filteredComments: Comment[] = isDoctor
        ? allComments
        : comments.publicComments;

    return (
        <div className="w-full">
            <div className="mx-auto max-w-5xl pb-12 px-4 text-primary w-full">

                <div className="mt-10">
                    <h2 className="text-7xl font-medium leading-tight text-left">
                        {editedPet.name}
                    </h2>
                </div>
                <Separator />

                <h1 className='mt-6 text-lg font-semibold tracking-tight'>Pet details</h1>
                <div className='border border-neutral-300 bg-white shadow-lg rounded-md p-5 grid grid-cols-3 gap-4'>
                    <div className="col-span-1 tracking-tight">
                        {getPetIcon(editedPet.petType)}
                        <p className={`text-gray-900 ${editedPet.status.toLowerCase() === 'deceased' ? 'line-through' : ''}`}>
                            {editedPet.status.toLowerCase() === 'missing' ? `${capitalizeFirstLetter(editedPet.status)}?`
                                : editedPet.status.toLowerCase() === 'other' ? 'Other...'
                                    : capitalizeFirstLetter(editedPet.status)}
                        </p>

                        <p className="text-gray-900">{calculateAge(editedPet.dob)} years old</p>
                        <p className="text-gray-900">{formatDate(pet.dob)}</p>
                    </div>
                    <div className="col-span-1">
                        <h2 className='font-semibold underline'>Upcoming Visits</h2>
                        {upcomingVisits.map(visit => (
                            <div key={visit._id}>
                                <p>{formatDate(visit.date)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="col-span-1">
                        <h2 className='font-semibold underline'>Past Visits</h2>
                        {pastVisits.map(visit => (
                            <div key={visit._id}>
                                <p>{formatDate(visit.date)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex items-center mt-10 justify-end gap-x-2'>
                    <button onClick={openAddVisitModal} className="rounded-md px-3.5 py-2.5 text-sm font-semibold dark:text-white hover:shadow-sm hover:bg-neutral-200/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950">
                        Add a Visit
                    </button>
                    <button onClick={openEditPetDetailsModal} className="rounded-md bg-neutral-800 px-3.5 py-2.5 text-sm font-semibold text-white dark:text-white shadow-sm hover:bg-neutral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950">
                        Edit Details
                    </button>
                </div>

                <div>
                    <h1 className='mb-2 mt-6 text-lg font-semibold tracking-tight'>Upcoming Visits</h1>
                    <div className='border border-neutral-300 bg-white shadow-lg rounded-md p-5 grid grid-cols-3 gap-4'>
                        <div className="col-span-1">
                            <h2 className='font-semibold underline mb-5'>Upcoming Visits</h2>
                            {upcomingVisits.map(visit => (
                                <div key={visit._id} className='border border-neutral-300 mb-2 p-2 rounded-md bg-secondary'>
                                    <p className='font-semibold text-sm'>{formatDate(visit.date)}</p>
                                    {visitComments
                                        .filter(comment => comment.visitId === visit._id)
                                        .map((comment, index) => (
                                            <div key={index}>
                                                <Separator />
                                                <p className='px-2 mt-2 text-sm'>{comment.comment}</p>
                                            </div>
                                        ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                <div className='flex justify-between mt-40 mb-10 items-center'>
                    <h1 className='font-semibold text-lg bg-neutral-800 border-black text-white px-2 py-1 rounded-full cursor-default'>Remarks</h1>
                    {isDoctor && (
                        <button onClick={handleAddRemarkClick} className="group inline-flex items-center hover:border hover:bg-neutral-100 px-3 py-1 rounded-md">
                            <span className=" border-transparent pb-px transition motion-reduce:transition-none font-semibold">
                                Add Remark
                            </span>
                            <span className="whitespace-nowrap">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="black"
                                    className="ml-1 inline-block h-4 w-4 shrink-0 -translate-y-px transition-transform group-hover:translate-x-2 motion-reduce:transition-none"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                        </button>
                    )}
                </div>

                {showEditor && (
                    <div ref={editorRef}>
                        <h2 className='font-semibold text-neutral-600'>Create your remarks</h2>
                        <div className='border-2 border-neutral-400 rounded-md'>
                            <Editor onContentChange={handleEditorContentChange} />
                        </div>
                        <div className='mt-2 flex gap-2 justify-center'>
                            <button onClick={handleMedicalNoteClick} className='text-sm font-semibold border bg-white hover:bg-neutral-100 text-neutral-800 px-2 py-2 rounded-md'>Medical Note</button>
                            <button onClick={handlePublicRemarkClick} className='text-sm font-semibold bg-neutral-800 hover:bg-neutral-700 text-white px-2 py-2 rounded-md'>Public Remark</button>
                        </div>
                    </div>
                )}

                {filteredComments.map(comment => (
                    <div key={comment._id} className='mb-4'>
                        <div className='flex font-semibold mt-4 px-2' style={{ alignItems: 'center' }}>
                            <p className='flex-grow'>
                                {comments.doctorComments.includes(comment) ? 'Private' : 'Public'}
                            </p>
                            {isDoctor && (
                                <p onClick={() => handleRemoveComment(pet._id, comment._id)} className='ml-auto text-xs text-red-500 hover:text-red-700 hover:underline cursor-pointer'>
                                    Remove Remark
                                </p>
                            )}
                        </div>

                        <div className='border-2 border-neutral-400 shadow-lg shadow-neutral-300 bg-secondary rounded-md p-2'>
                            <div>
                                <p className='flex justify-end text-sm font-semibold underline'>
                                    {`${formatDateCustom(new Date(comment.createdAt as string))} · ${formatTimeCustom(new Date(comment.createdAt as string))}`}
                                </p>
                                <p style={{ whiteSpace: 'pre-line' }} className='p-2'>{comment.content}</p>
                                <p className='flex justify-end text-sm font-bold'>
                                    {comment.author?.role === 'doctor' ? (
                                        <>
                                            <span className='text-blue-500'>DR</span>&nbsp;{comment.author?.name}
                                        </>
                                    ) : (
                                        comment.author?.name || 'Anonymous'
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PetDetails;
