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
import { fetchRecentActivitiesOfUser, createActivity } from '../controllers/userController.js';

const router = express.Router();
//Note that limit is a string, not int
// {
//     "username": "rustam",
//     "limit": "2"
// }
  
router.post('/recent-activities', fetchRecentActivitiesOfUser);



//NO USE ONLY FOR TESTING FUNCTION
// router.post('/activity', async (req, res, next) => {
//     try {
//       const { username, description } = req.body;
//       const data = await createActivity(username, description);
//       res.status(201).json({ activity: data });
//     } catch (error) {
//       next(error);
//     }
//   });
  
export default router;
