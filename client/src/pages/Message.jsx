/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, Textarea } from "flowbite-react";
import {
  ThumbsUp,
  Heart,
  Smile,
  Frown,
  Zap,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [reactions, setReactions] = useState({});
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyContent, setReplyContent] = useState("");

  // Get current user from Redux store.
  const { currentUser } = useSelector((state) => state.user);
  const usernameForApi = currentUser?.username || "charlie";

  // Fetch notifications from the backend on component mount.
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const payload = { username: usernameForApi };
        const response = await fetch("/api/user/get-all-notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        const mappedMessages = data.map((notification) => ({
          id: notification.id,
          sender: notification.sender,
          subject: notification.subject,
          message: notification.message,
          time: new Date(notification.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setMessages(mappedMessages);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [usernameForApi]);

  const handleReact = (id, reaction) => {
    setReactions((prev) => ({ ...prev, [id]: reaction }));
  };

  const openReplyModal = (msg) => {
    setReplyTo(msg);
    setReplySubject("");
    setReplyContent("");
    setShowReplyModal(true);
  };

  const handleSendReply = async () => {
    if (!replySubject.trim() || !replyContent.trim()) {
      alert("Subject and Message cannot be empty!");
      return;
    }
    try {
      const payload = {
        username: replyTo.sender,
        sender: usernameForApi,
        subject: replySubject,
        message: replyContent,
      };
      const response = await fetch("/api/user/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to send message");
      }
      console.log(
        `Message sent to ${replyTo.sender}: Subject: ${replySubject} | Message: ${replyContent}`
      );
      setShowReplyModal(false);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 p-6">
      <h1 className="bg-sky-400 p-4 rounded-md border-b-4 border-sky-800 text-4xl font-extrabold mb-8 text-gray-800 dark:text-gray-200 text-center shadow-md">
        Messages
      </h1>
      <div className="space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold">
                  {msg.sender.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {msg.sender}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {msg.time}
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200 bg-sky-100 dark:bg-sky-800 px-3 py-1 rounded-full">
                {msg.subject}
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-200 mb-4">{msg.message}</p>
            <div className="flex items-center space-x-3">
              {/* Reaction Buttons */}
              <Button
                size="xs"
                onClick={() => handleReact(msg.id, "Like")}
                title="Like"
                color="primary"
                className="flex items-center gap-1"
              >
                <ThumbsUp size={16} className="text-blue-600" />
              </Button>
              <Button
                size="xs"
                onClick={() => handleReact(msg.id, "Love")}
                title="Love"
                color="failure"
                className="flex items-center gap-1"
              >
                <Heart size={16} className="text-red-600" />
              </Button>
              <Button
                size="xs"
                onClick={() => handleReact(msg.id, "Haha")}
                title="Haha"
                color="warning"
                className="flex items-center gap-1"
              >
                <Smile size={16} className="text-yellow-600" />
              </Button>
              <Button
                size="xs"
                onClick={() => handleReact(msg.id, "Wow")}
                title="Wow"
                color="info"
                className="flex items-center gap-1"
              >
                <Zap size={16} className="text-purple-600" />
              </Button>
              <Button
                size="xs"
                onClick={() => handleReact(msg.id, "Sad")}
                title="Sad"
                color="dark"
                className="flex items-center gap-1"
              >
                <Frown size={16} className="text-gray-600" />
              </Button>
              <Button
                size="xs"
                onClick={() => handleReact(msg.id, "Angry")}
                title="Angry"
                color="secondary"
                className="flex items-center gap-1"
              >
                <AlertTriangle size={16} className="text-orange-600" />
              </Button>
              {/* Reply Button */}
              <Button
                size="xs"
                onClick={() => openReplyModal(msg)}
                color="success"
                className="flex items-center gap-1"
              >
                <MessageSquare size={16} />
                <span>Reply</span>
              </Button>
              {reactions[msg.id] && (
                <span className="ml-3 text-sm text-blue-600 dark:text-blue-400">
                  Reacted with {reactions[msg.id]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reply / Send Message Modal */}
      <Modal show={showReplyModal} onClose={() => setShowReplyModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          {replyTo && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Send Message to {replyTo.sender}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    {replyTo.sender.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    To: {replyTo.sender}
                  </span>
                </div>
                <TextInput
                  id="replySubject"
                  placeholder="Subject"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                />
                <Textarea
                  id="replyContent"
                  placeholder="Type your message here..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button color="gray" onClick={() => setShowReplyModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendReply}>Send Message</Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
