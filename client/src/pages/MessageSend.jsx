// /* eslint-disable react/prop-types */
// import React, { useState, useEffect, useRef } from "react";
// import { Button, TextInput } from "flowbite-react";
// import { Send, Clock } from "lucide-react";
// import { useSelector } from "react-redux";

// // Sidebar component to list all conversation partners
// function ChatSidebar({ currentUsername, onSelectConversation }) {
//   const [conversations, setConversations] = useState([]);

//   const fetchConversations = async () => {
//     try {
//       const payload = { currentUsername };
//       const response = await fetch("/api/user/get-conversation1", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to fetch conversation list");
//       }
//       const data = await response.json();
//       setConversations(data);
//     } catch (error) {
//       console.error("Error fetching conversation list:", error);
//     }
//   };

//   // Poll for updated conversation list every 5 seconds
//   useEffect(() => {
//     fetchConversations();
//     const intervalId = setInterval(() => {
//       fetchConversations();
//     }, 500000000);
//     return () => clearInterval(intervalId);
//   }, [currentUsername]);

//   return (
//     <div className="w-64 border-r border-gray-200 dark:border-gray-600 p-4 overflow-y-auto">
//       <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//         Conversations
//       </h2>
//       {conversations.map((conv) => (
//         <div
//           key={conv.partner}
//           className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
//           onClick={() => onSelectConversation(conv.partner)}
//         >
//           <p className="font-medium text-gray-800 dark:text-white">{conv.partner}</p>
//           <p className="text-xs text-gray-500">{conv.lastMessage}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// // Main ChatBox component for one-to-one conversation
// function ChatBox({ currentUsername, conversationPartner }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef(null);

//   const fetchConversation = async () => {
//     try {
//       const payload = { currentUsername, conversationPartner };
//       const response = await fetch("/api/user/get-conversation", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to fetch conversation");
//       }
//       const data = await response.json();
//       // Sort messages from oldest to newest
//       const sortedMessages = data.sort(
//         (a, b) => new Date(a.created_at) - new Date(b.created_at)
//       );
//       setMessages(sortedMessages);
//     } catch (error) {
//       console.error("Error fetching conversation:", error);
//     }
//   };

//   // Poll for conversation messages every 5 seconds
//   useEffect(() => {
//     if (conversationPartner) {
//       fetchConversation();
//       const intervalId = setInterval(() => {
//         fetchConversation();
//       }, 5000);
//       return () => clearInterval(intervalId);
//     }
//   }, [conversationPartner, currentUsername]);

//   // Auto scroll to the bottom when messages update
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;
//     try {
//       const payload = {
//         username: conversationPartner, // receiver
//         sender: currentUsername,
//         message: newMessage,
//         // Optionally include subject
//       };
//       const response = await fetch("/api/user/send-notification", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!response.ok) {
//         const errData = await response.json();
//         throw new Error(errData.error || "Failed to send message");
//       }
//       setNewMessage("");
//       // Refresh conversation immediately after sending
//       fetchConversation();
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       {/* Chat Header */}
//       <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//           Chat with {conversationPartner}
//         </h2>
//       </div>

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
//         {messages.map((msg) => {
//           const isSent = msg.sender === currentUsername;
//           return (
//             <div
//               key={msg.id}
//               className={`flex ${isSent ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`max-w-xs p-3 rounded-lg shadow 
//                   ${isSent 
//                     ? "bg-blue-500 text-white rounded-br-none" 
//                     : "bg-gray-200 text-gray-800 rounded-bl-none"}`}
//               >
//                 <p>{msg.message}</p>
//                 <div className="text-xs mt-1 flex items-center justify-end">
//                   <Clock size={14} className="mr-1" />
//                   <span>
//                     {new Date(msg.created_at).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Message Input */}
//       <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-600">
//         <div className="flex space-x-2">
//           <TextInput
//             placeholder="Type your message..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             className="flex-1"
//           />
//           <Button onClick={handleSendMessage} color="blue">
//             <Send size={16} />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Main Chat App that integrates the sidebar and chatbox
// export default function MessageSend() {
//   const { currentUser } = useSelector((state) => state.user);
//   const currentUsername = currentUser?.username || "ch_arlie";
//   const [selectedConversationPartner, setSelectedConversationPartner] = useState(null);

//   return (
//     <div className="h-screen flex bg-gray-100 dark:bg-gray-800">
//       {/* Sidebar with conversation list */}
//       <ChatSidebar 
//         currentUsername={currentUsername} 
//         onSelectConversation={setSelectedConversationPartner} 
//       />

//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {selectedConversationPartner ? (
//           <ChatBox 
//             currentUsername={currentUsername} 
//             conversationPartner={selectedConversationPartner} 
//           />
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
//             Select a conversation to start chatting
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
