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
import { fetchRecentActivitiesOfUser, createActivity, updateUser, signout } from '../controllers/userController.js';
import { fetchNotifications, sendNotification, markNotificationAsSeen, markNotificationAsUnseen, fetchNotifications1, getConversation, getConversation1 } from '../controllers/notificationController.js';
import { verifyToken } from '../utilis/verifyUser.js';


const router = express.Router();
//Note that limit is a string, not int
// {
//     "username": "rustam",
//     "limit": "2"
// }
  
router.post('/recent-activities', fetchRecentActivitiesOfUser);
router.put('/update/:userId',verifyToken,updateUser);
router.post('/signout', signout);
router.post('/get-all-notifications', fetchNotifications);             // Get notifications for a user
router.post('/send-notification', sendNotification);                // Send a notification
router.post('/mark-notification-seen', markNotificationAsSeen);     // Mark a notification as seen
router.post('/mark-notification-unseen', markNotificationAsUnseen); // Mark a notification as unseen
router.post('/get-all-send-notifications', fetchNotifications1);  
router.post('/get-conversation', getConversation);  
router.post('/get-conversation1', getConversation1);  


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
