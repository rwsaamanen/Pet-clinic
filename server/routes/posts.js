import express from 'express';
import { 
    getPets, createPet, updatePet,
    getUsers, createUser, updateUser, login,
    getVisits, createVisit, updateVisit
} from '../controllers/controller.js';

const router = express.Router();

// Pet routes

router.get('/pets', getPets);
router.post('/pets', createPet);
router.put('/pets/:id', updatePet);

// User routes

router.get('/users', getUsers);
router.post('/users/signup', createUser);
router.post('/users/login', login);
router.put('/users/:id', updateUser);

// Visit routes

router.get('/visits', getVisits);
router.post('/visits', createVisit);
router.put('/visits/:id', updateVisit);

export default router;
