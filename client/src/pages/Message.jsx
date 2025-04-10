import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, Textarea } from "flowbite-react";
import {
  ThumbsUp, Heart, Smile, Frown, Zap, AlertTriangle, MessageSquare,
  Send, SmilePlus, Paperclip
} from "lucide-react";
import { useSelector } from "react-redux";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [reactions, setReactions] = useState({});
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyContent, setReplyContent] = useState("");

  // Get current user from Redux store
  const { currentUser } = useSelector((state) => state.user);
  const usernameForApi = currentUser?.username || "charlie";

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
          date: new Date(notification.created_at).toLocaleDateString(),
          status: notification.status
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

  // Group messages by date
  const groupMessagesByDate = () => {
    const grouped = {};
    messages.forEach(msg => {
      if (!grouped[msg.date]) {
        grouped[msg.date] = [];
      }
      grouped[msg.date].push(msg);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-700 shadow py-4 px-6">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Messages</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          {messages.length} conversations
        </p>
      </div>
      
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.keys(groupedMessages).map(date => (
          <div key={date} className="mb-6">
            <div className="flex justify-center mb-4">
              <span className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200 text-xs px-3 py-1 rounded-full">
                {date}
              </span>
            </div>
            
            {groupedMessages[date].map((msg) => (
              <div key={msg.id} className="mb-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0 mr-2">
                    {msg.sender.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="max-w-3/4">
                    <div className="flex items-center mb-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{msg.sender}</p>
                      <span className="ml-2 text-xs text-gray-500">{msg.time}</span>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow">
                      {msg.subject && (
                        <div className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                          {msg.subject}
                        </div>
                      )}
                      <p className="text-gray-700 dark:text-gray-300">{msg.message}</p>
                    </div>
                    
                    <div className="mt-2 flex space-x-2">
                      <button 
                        onClick={() => handleReact(msg.id, "Like")}
                        className="text-gray-500 hover:text-blue-500 text-xs flex items-center"
                      >
                        <ThumbsUp size={14} className="mr-1" />
                        Like
                      </button>
                      <button 
                        onClick={() => openReplyModal(msg)}
                        className="text-gray-500 hover:text-green-500 text-xs flex items-center"
                      >
                        <MessageSquare size={14} className="mr-1" />
                        Reply
                      </button>
                      <button 
                        className="text-gray-500 hover:text-yellow-500 text-xs flex items-center"
                      >
                        <SmilePlus size={14} className="mr-1" />
                        React
                      </button>
                    </div>
                    
                    {reactions[msg.id] && (
                      <div className="mt-1 ml-2 text-xs text-blue-600 dark:text-blue-400">
                        Reacted with {reactions[msg.id]}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Message Input */}
      <div className="bg-white dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center">
          <button className="text-gray-500 hover:text-blue-500 mr-2">
            <Paperclip size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 dark:border-gray-500 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <button className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2">
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Reply Modal */}
      <Modal show={showReplyModal} onClose={() => setShowReplyModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          {replyTo && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Reply to {replyTo.sender}
              </h2>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {replyTo.sender.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {replyTo.sender}
                </span>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg mb-4">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {replyTo.subject}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{replyTo.message}</p>
              </div>
              
              <TextInput
                id="replySubject"
                placeholder="Subject"
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                className="mb-3"
              />
              <Textarea
                id="replyContent"
                placeholder="Type your reply here..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={4}
              />
              
              <div className="flex justify-end gap-3 mt-4">
                <Button color="gray" onClick={() => setShowReplyModal(false)}>
                  Cancel
                </Button>
                <Button color="blue" onClick={handleSendReply}>
                  <Send size={16} className="mr-2" /> Send
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}