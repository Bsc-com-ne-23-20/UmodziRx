const express = require('express');
const path = require('path');
// Use absolute path to ensure correct file resolution
const UserController = require(path.join(__dirname, '../controllers/UserController'));

const router = express.Router();


// Admin user management routes (updated to match your frontend)
router.post('/users', UserController.addUser);
router.get('/users', UserController.getUsers);
router.get('/users/:digitalID', UserController.getUserById);
router.put('/users/:digitalID', UserController.updateUser); // Added missing PUT route
router.delete('/users/:digitalID', UserController.deleteUser);

module.exports = router;