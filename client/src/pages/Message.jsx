/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Modal, TextInput, Textarea } from "flowbite-react";
import {
  ThumbsUp,
  Heart,
  MessageSquare,
  Smile,
  Frown,
  Zap,
  AlertTriangle,
} from "lucide-react";

// Dummy messages data
const dummyMessages = [
  {
    id: 1,
    sender: "Alice",
    subject: "Greetings",
    message: "Hi, how are you doing today?",
    time: "10:00 AM",
  },
  {
    id: 2,
    sender: "Bob",
    subject: "Re: Greetings",
    message: "I'm doing well, thanks. What about you?",
    time: "10:05 AM",
  },
  {
    id: 3,
    sender: "Alice",
    subject: "Re: Greetings",
    message: "I'm good too, thanks for asking!",
    time: "10:06 AM",
  },
];

export default function Messages() {
  const [messages, setMessages] = useState(dummyMessages);
  // Store reactions per message id; each reaction value could be "like", "love", etc.
  const [reactions, setReactions] = useState({});
  // State for the send/reply modal
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyContent, setReplyContent] = useState("");

  // Handle reaction button click. For now, one reaction per message.
  const handleReact = (id, reaction) => {
    setReactions((prev) => ({ ...prev, [id]: reaction }));
  };

  // Open the reply/send modal with the chosen message as the recipient
  const openReplyModal = (msg) => {
    setReplyTo(msg);
    setReplySubject("");
    setReplyContent("");
    setShowReplyModal(true);
  };

  // Handle sending the reply
  const handleSendReply = () => {
    if (!replySubject.trim() || !replyContent.trim()) {
      // You can replace the alert with your SweetAlert2 implementation.
      alert("Subject and Message cannot be empty!");
      return;
    }
    // Simulate an API call with a timeout (replace with your actual endpoint call)
    console.log(`Sending message to ${replyTo.sender}: Subject: ${replySubject} | Message: ${replyContent}`);
    // After sending, close modal.
    setShowReplyModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Messages
      </h1>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {msg.sender}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  {msg.time}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {msg.subject}
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              {msg.message}
            </p>
            <div className="flex items-center space-x-2">
              {/* Reaction Options */}
              <Button
                size="xs"
                onClick={() => handleReact(msg.id, "Like")}
                title="Like"
              >
                <ThumbsUp size={16} />
              </Button>
              <Button
                size="xs"
                onClick={() => handleReact(msg.id, "Love")}
                title="Love"
              >
                <Heart size={16} />
              </Button>
              <Button
                size="xs"
                onClick={() => handleReact(msg.id, "Haha")}
                title="Haha"
              >
                <Smile size={16} />
              </Button>
              <Button
                size="xs"
                onClick={() => handleReact(msg.id, "Wow")}
                title="Wow"
              >
                <Zap size={16} />
              </Button>
              <Button
                size="xs"
                onClick={() => handleReact(msg.id, "Sad")}
                title="Sad"
              >
                <Frown size={16} />
              </Button>
              <Button
                size="xs"
                onClick={() => handleReact(msg.id, "Angry")}
                title="Angry"
              >
                <AlertTriangle size={16} />
              </Button>
              {/* Reply Button */}
              <Button size="xs" onClick={() => openReplyModal(msg)}>
                <MessageSquare size={16} />
                <span className="ml-1">Reply</span>
              </Button>
              {reactions[msg.id] && (
                <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
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
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Send Message to {replyTo.sender}
              </h2>
              <div className="space-y-2">
                <div>
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
