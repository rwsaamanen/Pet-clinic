import bcrypt from 'bcryptjs';

import Pets from '../models/pets.js';
import User from '../models/users.js';
import Visit from '../models/visits.js';

// Fetch all pets
export const getPets = async (req, res) => {
    try {
        const pets = await Pets.find();
        res.status(200).json(pets);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Create a new pet
export const createPet = async (req, res) => {
    const pet = new Pets(req.body);
    try {
        await pet.save();
        res.status(201).json(pet);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Update a pet
export const updatePet = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedPet = await Pets.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json(updatedPet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Fetch all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Sign up a new user
export const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ name, email, password: hashedPassword });

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User login
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

        // If you plan to use JWT or sessions, add the logic here

        res.status(200).json({ result: user, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a user
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


// Fetch all visits
export const getVisits = async (req, res) => {
    try {
        const visits = await Visit.find().populate('petId');
        res.status(200).json(visits);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Create a new visit
export const createVisit = async (req, res) => {
    const visit = new Visit(req.body);
    try {
        await visit.save();
        res.status(201).json(visit);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Update a visit
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
