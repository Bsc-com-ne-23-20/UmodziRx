const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();

// Route to add a new user
router.post('/users', UserController.addUser);

// Route to get all users
router.get('/users', UserController.getUsers);

// Route to get a user by digital ID
router.get('/users/:digitalID', UserController.getUserById); // Newm route

// Route to delete a user by digital ID
router.delete('/users/:digitalID', UserController.deleteUser);

module.exports = router;
