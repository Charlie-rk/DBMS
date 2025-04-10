import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, Textarea } from "flowbite-react";
import {
  MessageSquare,
  Send,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  Search
} from "lucide-react";
import { useSelector } from "react-redux";

export default function MessageSend() {
  const [sentMessages, setSentMessages] = useState([]);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [groupByRecipient, setGroupByRecipient] = useState(false);

  // Get current user from Redux store
  const { currentUser } = useSelector((state) => state.user);
  const usernameForApi = currentUser?.username || "ch_arlie";

  useEffect(() => {
    fetchSentMessages();
  }, [usernameForApi]);

  const fetchSentMessages = async () => {
    try {
      const payload = { username: usernameForApi };
      const response = await fetch("/api/user/get-all-send-notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch sent messages");
      }
      const data = await response.json();
      const mappedMessages = data.map((notification) => ({
        id: notification.id,
        recipient: notification.username,
        subject: notification.subject,
        message: notification.message,
        status: notification.status,
        time: new Date(notification.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date(notification.created_at).toLocaleDateString(),
        fullDate: new Date(notification.created_at)
      }));
      setSentMessages(mappedMessages);
    } catch (error) {
      console.error("Error fetching sent messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!recipient.trim() || !subject.trim() || !messageContent.trim()) {
      alert("Recipient, Subject and Message cannot be empty!");
      return;
    }
    try {
      const payload = {
        username: recipient,
        sender: usernameForApi,
        subject: subject,
        message: messageContent,
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
      
      // Refresh messages after sending
      fetchSentMessages();
      setShowComposeModal(false);
      resetComposeForm();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const resetComposeForm = () => {
    setRecipient("");
    setSubject("");
    setMessageContent("");
  };

  // Filter messages based on search
  const filteredMessages = sentMessages.filter(msg => 
    msg.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group messages by recipient if selected
  const getGroupedOrSortedMessages = () => {
    if (groupByRecipient) {
      const grouped = {};
      filteredMessages.forEach(msg => {
        if (!grouped[msg.recipient]) {
          grouped[msg.recipient] = [];
        }
        grouped[msg.recipient].push(msg);
      });
      return grouped;
    } else {
      // Sort by date if not grouping
      return filteredMessages.sort((a, b) => b.fullDate - a.fullDate);
    }
  };

  const messagesData = getGroupedOrSortedMessages();

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-700 shadow py-4 px-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Sent Messages</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {sentMessages.length} messages sent
          </p>
        </div>
        <Button color="blue" onClick={() => setShowComposeModal(true)}>
          <Send size={16} className="mr-2" /> Compose New
        </Button>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="bg-white dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 p-3 flex items-center">
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="ml-4 flex items-center">
          <Button
            color={groupByRecipient ? "blue" : "gray"}
            size="sm"
            onClick={() => setGroupByRecipient(!groupByRecipient)}
          >
            <User size={16} className="mr-1" /> 
            {groupByRecipient ? "Grouped by Recipient" : "Group by Recipient"}
            {groupByRecipient ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
          </Button>
        </div>
      </div>
      
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4">
        {groupByRecipient ? (
          // Grouped by recipient view
          Object.keys(messagesData).map(recipient => (
            <div key={recipient} className="mb-6">
              <div className="flex items-center mb-3 bg-gray-200 dark:bg-gray-600 p-2 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0 mr-2">
                  {recipient.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-gray-800 dark:text-white">{recipient}</span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">
                  ({messagesData[recipient].length} messages)
                </span>
              </div>
              
              {messagesData[recipient].map(msg => (
                <div key={msg.id} className="pl-10 mb-4">
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800 dark:text-white">{msg.subject}</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock size={14} className="mr-1" />
                        <span>{msg.date} at {msg.time}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{msg.message}</p>
                    <div className="mt-2 text-xs">
                      <span className={`px-2 py-1 rounded-full ${
                        msg.status === "read" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}>
                        {msg.status === "read" ? "Read" : "Unread"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          // Chronological view
          messagesData.map(msg => (
            <div key={msg.id} className="mb-4">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0 mr-2">
                      {msg.recipient.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">To: {msg.recipient}</h3>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock size={12} className="mr-1" />
                        <span>{msg.date} at {msg.time}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    msg.status === "read" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}>
                    {msg.status === "read" ? "Read" : "Unread"}
                  </span>
                </div>
                
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    {msg.subject}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">{msg.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Compose Message Modal */}
      <Modal show={showComposeModal} onClose={() => setShowComposeModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Compose New Message
            </h2>
            
            <TextInput
              id="recipient"
              placeholder="Recipient username"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="mb-3"
            />
            
            <TextInput
              id="subject"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mb-3"
            />
            
            <Textarea
              id="messageContent"
              placeholder="Type your message here..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={5}
            />
            
            <div className="flex justify-end gap-3 mt-4">
              <Button color="gray" onClick={() => setShowComposeModal(false)}>
                Cancel
              </Button>
              <Button color="blue" onClick={handleSendMessage}>
                <Send size={16} className="mr-2" /> Send Message
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}