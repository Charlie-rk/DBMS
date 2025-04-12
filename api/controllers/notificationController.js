
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { errorHandler } from '../utilis/error.js';
import { io, userSocketMap } from '../index.js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tvgasdupkqffhvqzurwy.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Fetch all notifications for a given username
 */
export async function fetchNotifications(req, res, next) {
  const { username } = req.body;

  if (!username) return next(errorHandler(400, 'Username is required'));

  try {
    const { data, error } = await supabase
      .from('notification')
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: false });

    if (error) return next(errorHandler(500, error.message));

    res.status(200).json(data);
  } catch (err) {
    next(errorHandler(500, err.message || 'Failed to fetch notifications'));
  }
}

/**
 * Fetch all notifications for a given username
 */
export async function fetchNotifications1(req, res, next) {
  const { username } = req.body;

  if (!username) return next(errorHandler(400, 'Username is required'));

  try {
    const { data, error } = await supabase
      .from('notification')
      .select('*')
      .eq('sender', username)
      .order('created_at', { ascending: false });

    if (error) return next(errorHandler(500, error.message));

    res.status(200).json(data);
  } catch (err) {
    next(errorHandler(500, err.message || 'Failed to fetch notifications'));
  }
}


/**
 * Mark a notification as "read"
 */
export async function markNotificationAsSeen(req, res, next) {
  const { notificationId } = req.body;

  if (!notificationId) return next(errorHandler(400, 'Notification ID is required'));

  try {
    const { data, error } = await supabase
      .from('notification')
      .update({ status: 'read' })
      .eq('id', notificationId)
      .select();

    if (error) return next(errorHandler(500, error.message));

    res.status(200).json(data?.[0] || {});
  } catch (err) {
    next(errorHandler(500, err.message || 'Failed to mark notification as read'));
  }
}

/**
 * Mark a notification as "unread"
 */
export async function markNotificationAsUnseen(req, res, next) {
  const { notificationId } = req.body;

  if (!notificationId) return next(errorHandler(400, 'Notification ID is required'));

  try {
    const { data, error } = await supabase
      .from('notification')
      .update({ status: 'unread' })
      .eq('id', notificationId)
      .select();

    if (error) return next(errorHandler(500, error.message));

    res.status(200).json(data?.[0] || {});
  } catch (err) {
    next(errorHandler(500, err.message || 'Failed to mark notification as unread'));
  }
}
/**
 * Send a new notification using Socket.IO for real-time delivery
 */
export async function sendNotification(req, res, next) {
  console.log("Send notification request:", req.body);
  const { username, sender, subject, message } = req.body;

  if (!username || !message) {
    return next(errorHandler(400, 'Username, and message are required'));
  }

  try {
    const { data, error } = await supabase
      .from('notification')
      .insert([{ username, sender, subject, message, status: 'unread' }])
      .select();

    if (error) return next(errorHandler(500, error.message));

    const notificationData = data?.[0] || {};
    res.status(201).json(notificationData);

    // Emit to the connected client(s) if available
    const recipientSockets = userSocketMap[username];
    if (recipientSockets && recipientSockets.length > 0) {
      recipientSockets.forEach(socketId => {
        io.to(socketId).emit('notification', notificationData);
      });
      console.log(`Emitted notification to sockets: ${recipientSockets.join(', ')}`);
    } else {
      console.log('No active socket connection for:', username);
    }
  } catch (err) {
    next(errorHandler(500, err.message || 'Failed to send notification'));
  }
}
/**
 * Fetch conversation messages between the current user and the partner
 */
export async function getConversation(req, res, next) {
  const { currentUsername, conversationPartner } = req.body;

  if (!currentUsername || !conversationPartner) {
    return next(errorHandler(400, 'Both currentUsername and conversationPartner are required'));
  }

  try {
    // Fetch messages where either:
    // 1. current user is the sender and conversation partner is the receiver, or
    // 2. conversation partner is the sender and current user is the receiver.
    const { data, error } = await supabase
      .from('notification')
      .select('*')
      .or(
        `and(sender.eq.${currentUsername},username.eq.${conversationPartner}),` +
        `and(sender.eq.${conversationPartner},username.eq.${currentUsername})`
      )
      .order('created_at', { ascending: true });

    if (error) {
      return next(errorHandler(500, error.message));
    }

    res.status(200).json(data);
  } catch (err) {
    next(errorHandler(500, err.message || 'Failed to fetch conversation'));
  }
}

/**
 * Fetch a list of conversation summaries for the current user.
 * A conversation summary includes the conversation partner, last message, subject, and timestamp.
 */
export async function getConversation1(req, res, next) {
  const { currentUsername } = req.body;

  if (!currentUsername) {
    return next(errorHandler(400, 'currentUsername is required'));
  }

  try {
    // Fetch all messages where the current user is either the sender or the receiver.
    const { data, error } = await supabase
      .from('notification')
      .select('*')
      .or(`sender.eq.${currentUsername},username.eq.${currentUsername}`)
      // Get the most recent messages first.
      .order('created_at', { ascending: false });

    if (error) {
      return next(errorHandler(500, error.message));
    }

    // Process records to group by conversation partner.
    // If currentUser is the sender then partner is the receiver (username),
    // and if currentUser is the receiver then partner is the sender.
    const conversationsMap = {};

    data.forEach((record) => {
      // Determine the other participant in the conversation
      let partner;
      if (record.sender === currentUsername) {
        partner = record.username;
      } else {
        partner = record.sender;
      }

      // Use the first (i.e. most recent) record for each conversation partner
      if (!conversationsMap[partner]) {
        conversationsMap[partner] = record;
      }
    });

    // Convert the grouped data into an array.
    const conversationList = Object.keys(conversationsMap).map((partner) => {
      const record = conversationsMap[partner];
      return {
        partner,
        lastMessage: record.message,
        subject: record.subject,
        lastMessageTime: record.created_at,
      };
    });

    res.status(200).json(conversationList);
  } catch (err) {
    next(errorHandler(500, err.message || 'Failed to fetch conversations'));
  }
}
