import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { Send, ThumbsUp, SmilePlus, Info } from "lucide-react";
import { Button, TextInput } from "flowbite-react";

export default function ChatPage() {
  // Redux: current user info
  const { currentUser } = useSelector((state) => state.user);
  const usernameForApi = currentUser?.username || "charlie";

  // Socket state
  const [socket, setSocket] = useState(null);

  // Left panel: conversation list
  const [conversationList, setConversationList] = useState([]);

  // Selected conversation partner and messages for that conversation
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);

  // Right panel: partner's full profile info (fetched from backend)
  const [partnerInfo, setPartnerInfo] = useState(null);

  // New message input value
  const [newMessage, setNewMessage] = useState("");

  // Reactions dictionary (messageId: reaction)
  const [reactions, setReactions] = useState({});

  // Right panel visibility toggle state
  const [showRightPanel, setShowRightPanel] = useState(false);
  
  // Ref for message container scrolling
  const messageContainerRef = useRef(null);

  //------------------------------------------------------------------------------
  // 1. ESTABLISH SOCKET CONNECTION & LISTEN TO EVENTS
  //------------------------------------------------------------------------------
  useEffect(() => {
    if (!usernameForApi) return;

    const newSocket = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected with id:", newSocket.id);
      newSocket.emit("register", usernameForApi);
      console.log(`Emitted 'register' for user: ${usernameForApi}`);
    });

    // Listen for new message notifications
    newSocket.on("notification", (notification) => {
      console.log("Received notification:", notification);
      // Check if notification belongs to current conversation
      if (
        (notification.sender === selectedPartner &&
          notification.username === usernameForApi) ||
        (notification.sender === usernameForApi &&
          notification.username === selectedPartner)
      ) {
        // Append new message at the bottom
        setMessages((prev) => [...prev, notification]);
      } else {
        console.log("Notification for other conversation", notification);
      }
    });

    // Listen for reaction updates
    newSocket.on("reactionUpdate", ({ messageId, reaction }) => {
      console.log("Received reaction update:", messageId, reaction);
      setReactions((prev) => ({ ...prev, [messageId]: reaction }));
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    setSocket(newSocket);

    return () => {
      console.log("Cleaning up socket connection");
      newSocket.disconnect();
    };
  }, [usernameForApi, selectedPartner]);

  //------------------------------------------------------------------------------
  // 2. FETCH CONVERSATION LIST (LEFT SIDEBAR)
  //------------------------------------------------------------------------------
  const fetchConversationList = useCallback(async () => {
    try {
      const payload = { currentUsername: usernameForApi };
      const response = await fetch("/api/user/get-conversation1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to fetch conversation list");
      const data = await response.json();
      console.log("Fetched conversation list:", data);
      setConversationList(data);
    } catch (err) {
      console.error("Error fetching conversation list:", err);
    }
  }, [usernameForApi]);

  useEffect(() => {
    if (usernameForApi) {
      fetchConversationList();
    }
  }, [usernameForApi, fetchConversationList]);

  //------------------------------------------------------------------------------
  // 3. FETCH MESSAGES FOR SELECTED PARTNER (MAIN CHAT PANEL)
  //------------------------------------------------------------------------------
  const fetchConversationMessages = useCallback(async (partner) => {
    try {
      const payload = {
        currentUsername: usernameForApi,
        conversationPartner: partner,
      };
      const response = await fetch("/api/user/get-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      console.log("Fetched conversation messages:", data);
      setMessages(data);

      // Mark messages addressed to the current user and are unread as read
      data.forEach((msg) => {
        if (msg.status === "unread" && msg.username === usernameForApi) {
          markAsRead(msg.id);
        }
      });
    } catch (err) {
      console.error("Error fetching conversation messages:", err);
    }
  }, [usernameForApi]);

  // Called when user selects a conversation partner
  const selectPartner = (partner) => {
    setSelectedPartner(partner);
    setMessages([]);
    setPartnerInfo(null);
    fetchConversationMessages(partner);
    fetchPartnerInfo(partner);
    // Reset the right panel view when a new partner is selected
    setShowRightPanel(false);
  };

  //------------------------------------------------------------------------------
  // 4. FETCH SELECTED PARTNER PROFILE (RIGHT PANEL)
  //------------------------------------------------------------------------------
  const fetchPartnerInfo = async (partner) => {
    try {
      const response = await fetch(`/api/user/getUserProfile/${partner}`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to fetch partner info");
      const data = await response.json();
      console.log("Fetched partner info:", data);
      setPartnerInfo(data);
    } catch (err) {
      console.error("Error fetching partner info:", err);
    }
  };

  //------------------------------------------------------------------------------
  // 5. SENDING A NEW MESSAGE (including send on Enter key press)
  //------------------------------------------------------------------------------
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedPartner) return;
    try {
      const payload = {
        username: selectedPartner,
        sender: usernameForApi,
        subject: "", // Modify if needed
        message: newMessage.trim(),
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
      const newMsg = await response.json();
      console.log("Message sent:", newMsg);
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  // Key press handler for sending a message on Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline
      handleSendMessage();
    }
  };

  //------------------------------------------------------------------------------
  // 6. MARK MESSAGE AS READ (for each unread notification)
  //------------------------------------------------------------------------------
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch("/api/user/mark-notification-seen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      if (!response.ok) throw new Error("Failed to mark as read");
      console.log(`Message ${notificationId} marked as read`);
    } catch (err) {
      console.error(err);
    }
  };

  //------------------------------------------------------------------------------
  // 7. REACT TO A MESSAGE (updates broadcast to all clients)
  //------------------------------------------------------------------------------
  const handleReact = async (msgId, reaction) => {
    try {
      const response = await fetch("/api/user/react-to-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: msgId, reaction }),
      });
      if (!response.ok) throw new Error("Failed to update reaction");
      setReactions((prev) => ({ ...prev, [msgId]: reaction }));
      console.log(`Reaction for message ${msgId} set to ${reaction}`);
    } catch (err) {
      console.error("Error updating reaction:", err);
    }
  };

  // Utility: Get first letter of name for avatar
  const getNameInitial = (conv) => {
    if (conv.firstName) return conv.firstName.charAt(0).toUpperCase();
    return conv.partner.charAt(0).toUpperCase();
  };

  // Utility: Generate a background color based on username for avatar
  const getAvatarColor = (username) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-pink-500', 'bg-yellow-500', 'bg-red-500',
      'bg-indigo-500', 'bg-teal-500'
    ];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };
  
  // Auto-scroll to bottom of message container when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  //------------------------------------------------------------------------------
  // RENDER UI
  //------------------------------------------------------------------------------
  // Determine the width of the main chat panel based on right panel visibility.
  const chatPanelWidthClass = showRightPanel ? "w-1/2" : "w-3/4";
  return (
    <div className="flex h-screen w-full bg-sky-100 dark:bg-gray-900">
      {/* LEFT SIDEBAR: Conversation List */}
      <div className="flex flex-col w-1/6 border-r border-gray-200 dark:border-gray-700 bg-sky-100 dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Messages
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversationList.map((conv) => (
            <div
              key={conv.partner}
              className={`cursor-pointer px-4 py-3 flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ${
                selectedPartner === conv.partner
                  ? "bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500"
                  : ""
              }`}
              onClick={() => selectPartner(conv.partner)}
            >
              {/* Avatar with first letter */}
              <div
                className={`w-12 h-12 rounded-full ${getAvatarColor(
                  conv.partner
                )} flex items-center justify-center text-white font-bold text-xl shadow-md`}
              >
                {getNameInitial(conv)}
              </div>
              <div className="flex flex-col flex-grow overflow-hidden">
                <span className="font-medium text-gray-800 dark:text-gray-200 truncate">
                  {conv.partner}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {conv.subject || "Click to view conversation"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
  
      {/* Container for Main Chat Panel and Right Panel */}
      <div className="flex flex-1">
        {/* MAIN CHAT PANEL */}
        <div
          className={`${
            showRightPanel ? "w-2/3" : "w-full"
          } bg-gray-50 dark:bg-gray-900 flex flex-col`}
        >
          {/* Chat Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm">
            {selectedPartner ? (
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${getAvatarColor(
                    selectedPartner
                  )} flex items-center justify-center text-white font-bold`}
                >
                  {selectedPartner.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    {selectedPartner}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {partnerInfo?.role || "Online"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select a conversation
              </p>
            )}
            {selectedPartner && (
              <Button
                color="light"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setShowRightPanel((prev) => !prev)}
              >
                <Info size={18} />
                {showRightPanel ? "Hide Info" : "Info"}
              </Button>
            )}
          </div>
  
          {/* Chat Messages */}
          <div
            ref={messageContainerRef}
            className="flex-1 overflow-y-auto hide-scroll p-4 space-y-3 bg-gray-50 dark:bg-gray-900"
          >
            {messages.map((msg, index) => {
              const isMe = msg.sender === usernameForApi;
              const reaction = reactions[msg.id] || msg.reaction || null;
              const isLastInGroup =
                index === messages.length - 1 ||
                messages[index + 1].sender !== msg.sender;
              const isFirstInGroup =
                index === 0 || messages[index - 1].sender !== msg.sender;
  
              // Determine border radius based on position in message group
              let borderRadiusClass = "rounded-lg";
              if (isMe) {
                borderRadiusClass = isLastInGroup
                  ? "rounded-tl-lg rounded-bl-lg rounded-tr-lg rounded-br-none"
                  : "rounded-tl-lg rounded-tr-lg rounded-bl-lg";
              } else {
                borderRadiusClass = isLastInGroup
                  ? "rounded-tr-lg rounded-br-lg rounded-tl-lg rounded-bl-none"
                  : "rounded-tr-lg rounded-br-lg rounded-tl-lg";
              }
  
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {!isMe && isFirstInGroup && (
                    <div
                      className={`w-8 h-8 rounded-full ${getAvatarColor(
                        msg.sender
                      )} flex items-center justify-center text-white text-xs font-bold mr-2`}
                    >
                      {msg.sender.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {!isMe && !isFirstInGroup && <div className="w-8 mr-2"></div>}
  
                  <div className="flex flex-col max-w-xs">
                    <div
                      className={`p-3 ${borderRadiusClass} shadow-sm ${
                        isMe
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {msg.subject && (
                        <div className="text-xs font-semibold mb-1">
                          {msg.subject}
                        </div>
                      )}
                      <div className="text-sm">{msg.message}</div>
                    </div>
                    {reaction && (
                      <div
                        className={`mt-1 text-xs font-medium ${
                          isMe ? "text-right" : "text-left"
                        } text-gray-500`}
                      >
                        {reaction === "Like" ? "👍" : "❤️"}
                      </div>
                    )}
                  </div>
  
                  {!isMe && (
                    <button
                      className="ml-2 text-gray-400 hover:text-blue-500 transition-colors"
                      onClick={() => handleReact(msg.id, "Like")}
                    >
                      <ThumbsUp size={16} />
                    </button>
                  )}
                  {isMe && (
                    <button
                      className="ml-2 text-gray-400 hover:text-pink-500 transition-colors"
                      onClick={() => handleReact(msg.id, "Love")}
                    >
                      <SmilePlus size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
  
          {/* Message Input */}
          {selectedPartner && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <TextInput
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button color="blue" onClick={handleSendMessage} className="px-4">
                  <Send size={18} />
                </Button>
              </div>
            </div>
          )}
        </div>
  
        {/* RIGHT PANEL: Selected Partner Info */}
        {showRightPanel && (
          <div className="w-1/3 border-l border-gray-200 dark:border-gray-700 bg-sky-100 dark:bg-gray-800 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">
                  Profile Information
                </h3>
                <Button
                  size="xs"
                  color="light"
                  onClick={() => setShowRightPanel(false)}
                  className="text-gray-500"
                >
                  Close
                </Button>
              </div>
            </div>
  
            {partnerInfo ? (
              <div className="p-4 space-y-6">
                {/* Avatar & Name Section */}
                <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <img
                    src={partnerInfo.profile_picture}
                    alt={partnerInfo.name || partnerInfo.username}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 mb-4 shadow-md"
                  />
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {partnerInfo.name || partnerInfo.username}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{partnerInfo.username}
                  </p>
                </div>
  
                {/* Contact Information */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                  <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-1 rounded mr-2">
                      📞
                    </span>
                    Contact Information
                  </h4>
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center text-sm">
                      <span className="w-20 text-gray-500 dark:text-gray-400">
                        Email:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {partnerInfo.email}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-20 text-gray-500 dark:text-gray-400">
                        Mobile:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {partnerInfo.mobile}
                      </span>
                    </div>
                  </div>
                </div>
  
                {/* Personal Information */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                  <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
                    <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 p-1 rounded mr-2">
                      👤
                    </span>
                    Personal Details
                  </h4>
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center text-sm">
                      <span className="w-20 text-gray-500 dark:text-gray-400">
                        Gender:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {partnerInfo.gender}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-20 text-gray-500 dark:text-gray-400">
                        Birthday:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {new Date(partnerInfo.dob).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
  
                {/* Address Information */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                  <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 p-1 rounded mr-2">
                      🏠
                    </span>
                    Address
                  </h4>
                  <div className="text-sm text-gray-800 dark:text-gray-200 pl-2">
                    {partnerInfo.street}, {partnerInfo.city},<br />
                    {partnerInfo.state}, {partnerInfo.country}
                    <br />
                    PIN: {partnerInfo.pin_code}
                  </div>
                </div>
  
                {/* Professional Information */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                  <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
                    <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 p-1 rounded mr-2">
                      💼
                    </span>
                    Professional Details
                  </h4>
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center text-sm">
                      <span className="w-28 text-gray-500 dark:text-gray-400">
                        Role:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {partnerInfo.role}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-28 text-gray-500 dark:text-gray-400">
                        Specialization:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {partnerInfo.specialisation}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-28 text-gray-500 dark:text-gray-400">
                        Department:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {partnerInfo.department}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-28 text-gray-500 dark:text-gray-400">
                        Experience:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {partnerInfo.yoe} year{partnerInfo.yoe > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-28 text-gray-500 dark:text-gray-400">
                        Salary:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        ₹{partnerInfo.salary.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Loading user information...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}  