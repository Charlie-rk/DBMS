// import express from 'express';
// import {
//   deleteUser,
//   getUser,
//   getUsers,
//   signout,
//   test,
//   updateUser,

// } from '../controllers/userController.js';
// import { verifyToken } from './../utilis/verifyUser.js';

// const router = express.Router();

// router.get('/test', test);
// router.put('/update/:userId', verifyToken, updateUser);
// router.delete('/delete/:userId', verifyToken, deleteUser);
// router.post('/signout', signout);
// router.get('/getusers', verifyToken, getUsers);
// // router.get('/:userId', getUser);
// // router.get('/:userId/getRequest',getRequest);


// export default router;


import express from 'express';
import { fetchUsers, fetchUser } from '../controllers/userController.js';

const router = express.Router();
//to get all users, simply use the url
//to get all users with particular role, use like '/get_all_users?role=doctor'   (say)
router.get('/get-all-users', fetchUsers);

router.post('/get-user', fetchUser);

export default router;
