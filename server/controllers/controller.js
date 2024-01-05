import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Pets from '../models/pets.js';
import User from '../models/users.js';
import Visit from '../models/visits.js';

const SECRET_KEY = 's3cr3t';

// Fetch all pets.

export const getPets = async (req, res) => {
    try {

        const userId = req.userId;

        const user = await User.findById(userId);

        const pets = await Pets.find().populate('doctorComments publicComments');

        // Filter comments based on user role and pet ownership.

        const modifiedPets = pets.map(pet => {
            let filteredDoctorComments = [];
            let filteredPublicComments = [];

            if (user && user.role === 'doctor') {
                filteredDoctorComments = pet.doctorComments;
            }

            if (pet.ownerId.toString() === userId) {
                filteredPublicComments = pet.publicComments;
            }

            return {
                ...pet.toObject(),
                doctorComments: filteredDoctorComments,
                publicComments: filteredPublicComments
            };
        });

        res.status(200).json(modifiedPets);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Create a new pet.

export const createPet = async (req, res) => {
    const pet = new Pets(req.body);
    try {
        await pet.save();
        res.status(201).json(pet);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Update a pet.

export const updatePet = async (req, res) => {
    const { id } = req.params;
    const { comment, isPublic } = req.body;

    try {
        const pet = await Pets.findById(id);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        const newComment = {
            content: comment,
            author: req.userId,
            visibleToOwner: isPublic
        };

        if (isPublic) {
            pet.publicComments.push(newComment);
        } else {
            pet.doctorComments.push(newComment);
        }

        await pet.save();
        res.status(200).json(pet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Fetch all users.

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Sign up a new user.

export const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ email: result.email, id: result._id, role: result.role }, SECRET_KEY, { expiresIn: "1h" });
        res.status(201).json({ result: { name: result.name, email: result.email }, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User login.

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

        const userId = user._id;
        const userRole = user.role;

        res.status(200).json({ result: { name: user.name, email: user.email, id: userId, role: userRole }, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a user.

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Fetch all visits.

export const getVisits = async (req, res) => {
    try {
        const visits = await Visit.find().populate('petId', 'name');
        res.status(200).json(visits);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Create a new visit.

export const createVisit = async (req, res) => {
    const visit = new Visit(req.body);
    try {
        await visit.save();
        res.status(201).json(visit);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Update a visit.

export const updateVisit = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedVisit = await Visit.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json(updatedVisit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller function to handle adding a comment
export const addPetComment = async (req, res) => {
    const { petId, content, isPublic } = req.body;

    try {
        const pet = await Pets.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        const newComment = {
            petId,
            content,
            author: req.userId,
            visibleToOwner: isPublic
        };

        // Add comment to the appropriate array.

        if (isPublic) {
            pet.publicComments.push(newComment);
        } else {
            pet.doctorComments.push(newComment);
        }

        await pet.save();
        res.status(200).json(pet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller function to get comments for a specific pet

export const getPetComments = async (req, res) => {
    const { petId } = req.params;

    try {
        const pet = await Pets.findById(petId)
            .populate('publicComments.author', 'name role') 
            .populate('doctorComments.author', 'name role');

        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        res.status(200).json({
            publicComments: pet.publicComments,
            doctorComments: pet.doctorComments,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to handle removing a comment

export const removePetComment = async (req, res) => {
    console.log('Inside removePetComment controller');

    const { commentId } = req.params;
    const { petId } = req.params;

    try {
        const pet = await Pets.findById(petId);
        console.log('Pet ID:', petId);
        console.log('Comment ID:', commentId);

        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        console.log("User role:", req.userRole);
        if (req.userRole !== 'doctor') {
            return res.status(403).json({ message: "Only doctors can remove comments" });
        }        

        let commentArray = null;
        if (pet.doctorComments && pet.doctorComments.some(comment => comment._id.toString() === commentId)) {
            commentArray = pet.doctorComments;
        } else if (pet.publicComments && pet.publicComments.some(comment => comment._id.toString() === commentId)) {
            commentArray = pet.publicComments;
        }

        if (!commentArray) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const commentIndex = commentArray.findIndex(comment => comment._id.toString() === commentId);

        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Remove the comment from the array

        const removedComment = commentArray.splice(commentIndex, 1);

        await pet.save();

        res.status(200).json({ message: "Comment removed successfully", removedComment });
    } catch (error) {
        console.error("Error during MongoDB operation:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
