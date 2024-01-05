import express from 'express';
import auth from './middleware.js';
import { 
    getPets, createPet, updatePet,
    getUsers, createUser, updateUser, login,
    getVisits, createVisit, updateVisit, addPetComment, getPetComments, removePetComment
} from '../controllers/controller.js';

const router = express.Router();

// Pet routes

router.get('/pets', auth, getPets);
router.post('/pets', auth, createPet);
router.put('/pets/:id', auth, updatePet);

// Comments routes

router.get('/pets/:petId/comments', auth, getPetComments);
router.post('/pets/comment', auth, addPetComment);
router.delete('/pets/comments/:commentId/:petId', auth, removePetComment);

// User routes

router.get('/users', getUsers);
router.post('/users/signup', createUser);
router.post('/users/login', login);
router.put('/users/:id', auth, updateUser);

// Visit routes

router.get('/visits', auth, getVisits);
router.post('/visits', auth, createVisit);
router.put('/visits/:id', auth, updateVisit);

export default router;
