/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Accordion } from 'flowbite-react';
import { motion } from 'framer-motion';

export default function Help() {
  // Animation variants for container and inner content.
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { delayChildren: 0.3, staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div
      className="mt-10 md:p-20 md:mx-40 min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg shadow-lg"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
          WE ~ Go Hospital Management System
        </h1>
        <p className="text-xl font-medium text-blue-600 dark:text-blue-400 italic mt-2">
          "Where Compassion Meets Innovation"
        </p>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Welcome to the WE ~ Go Hospital Management System! This innovative healthcare solution was developed by Rustam Kumar, Sangam Kumar Mishra, Parth Dodiya, Utkarsh Singh, and Devanshu Dangi. Our system streamlines patient registration, appointment scheduling, admissions, discharges, and comprehensive data management.
        </p>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          Our mission is to empower healthcare professionals with advanced technology, ensuring efficient and compassionate patient care for all. We are committed to transforming hospital operations and making quality healthcare accessible.
        </p>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          We urge all users to utilize this system responsibly, ensuring that every action contributes to improved healthcare for our community. Together, let's build a future where efficient and compassionate care is accessible to all.
        </p>
      </motion.div>

      {/* Accordion FAQ Section */}
      <Accordion collapseAll>
        {/* Panel 1: About WE ~ Go */}
        <Accordion.Panel>
          <Accordion.Title>
            <motion.span variants={itemVariants} className="flex items-center">
              <span>About WE ~ Go</span>
              <span role="img" aria-label="hospital" className="ml-2" title="Hospital">
                🏥
              </span>
            </motion.span>
          </Accordion.Title>
          <Accordion.Content>
            <motion.div variants={itemVariants}>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                WE ~ Go is a state-of-the-art hospital management system designed to simplify and enhance healthcare operations. It encompasses patient registration, appointment scheduling, admissions, discharges, and data management—ensuring a smooth experience for both healthcare providers and patients.
              </p>
            </motion.div>
          </Accordion.Content>
        </Accordion.Panel>

        {/* Panel 2: How to Access the System Features */}
        <Accordion.Panel>
          <Accordion.Title>
            <motion.span variants={itemVariants} className="flex items-center">
              <span>How to Access the System Features?</span>
              <span role="img" aria-label="key" className="ml-2" title="Important">
                🔑
              </span>
            </motion.span>
          </Accordion.Title>
          <Accordion.Content>
            <motion.div variants={itemVariants}>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                To get started with WE ~ Go, follow these steps:
              </p>
              <ol className="list-decimal pl-5 mb-2 text-gray-500 dark:text-gray-400">
                <li>Create an account and log in to the platform.</li>
                <li>Navigate to the desired module (patient registration, appointment scheduling, or admissions).</li>
                <li>Follow the onscreen instructions and fill in the required details.</li>
                <li>Submit your request and wait for system confirmation.</li>
                <li>If any issues occur, check our Help section for troubleshooting tips.</li>
              </ol>
              <p className="text-gray-500 dark:text-gray-400">
                For further guidance, please refer to our <a href="/help/system-features" className="text-blue-600 dark:text-blue-500 hover:underline">System Features Guide</a>.
              </p>
            </motion.div>
          </Accordion.Content>
        </Accordion.Panel>

        {/* Panel 3: Privacy Concerns and Data Security */}
        <Accordion.Panel>
          <Accordion.Title>
            <motion.span variants={itemVariants} className="flex items-center">
              <span>Privacy & Data Security</span>
              <span role="img" aria-label="lock" className="ml-2" title="Important">
                🔒
              </span>
            </motion.span>
          </Accordion.Title>
          <Accordion.Content>
            <motion.div variants={itemVariants}>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                Your privacy and security are our top priorities. Here's how we ensure data protection:
              </p>
              <ul className="list-disc pl-5 mb-2 text-gray-500 dark:text-gray-400">
                <li>All personal information is encrypted and securely stored.</li>
                <li>We do not share your data with third parties without your explicit consent—except where legally required.</li>
                <li>We adhere to industry-standard security practices to prevent breaches or cyber threats.</li>
                <li>You can update or delete your personal data at any time through your account settings.</li>
              </ul>
              <p className="text-gray-500 dark:text-gray-400">
                For more details, please review our <a href="/privacy-policy" className="text-blue-600 dark:text-blue-500 hover:underline">Privacy Policy</a>.
              </p>
            </motion.div>
          </Accordion.Content>
        </Accordion.Panel>

        {/* Panel 4: General Questions */}
        <Accordion.Panel>
          <Accordion.Title>
            <motion.span variants={itemVariants} className="flex items-center">
              <span>General Questions</span>
              <span role="img" aria-label="question" className="ml-2" title="FAQ">
                ❓
              </span>
            </motion.span>
          </Accordion.Title>
          <Accordion.Content>
            <motion.div variants={itemVariants} className="space-y-4">
              {/* FAQ 1 */}
              <div>
                <p className="mb-2 text-gray-500 dark:text-gray-400"><strong>Q: How can I update my account details?</strong></p>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  A: You can update your account details by navigating to your profile settings. From there, you can modify your name, email, contact information, and other personal data.
                </p>
              </div>
              {/* FAQ 2 */}
              <div>
                <p className="mb-2 text-gray-500 dark:text-gray-400"><strong>Q: How do I reset my password?</strong></p>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  A: To reset your password, click the "Forgot Password" link on the login page. Follow the instructions sent to your registered email address to securely update your password.
                </p>
              </div>
              {/* FAQ 3 */}
              <div>
                <p className="mb-2 text-gray-500 dark:text-gray-400"><strong>Q: Who should I contact for technical support?</strong></p>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  A: For any technical issues or support inquiries, please contact our support team via the Help Desk or email <a href="mailto:support@wegohospital.com" className="text-blue-600 dark:text-blue-500 hover:underline">support@wegohospital.com</a>.
                </p>
              </div>
              {/* FAQ 4 */}
              <div>
                <p className="mb-2 text-gray-500 dark:text-gray-400"><strong>Q: How can I report a problem or provide feedback?</strong></p>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  A: We value your feedback. To report an issue or provide feedback, please use the "Feedback" option in your account dashboard or send your comments directly to our support email.
                </p>
              </div>
              {/* FAQ 5 */}
              <div>
                <p className="mb-2 text-gray-500 dark:text-gray-400"><strong>Q: What is the expected response time for support inquiries?</strong></p>
                <p className="text-gray-500 dark:text-gray-400">
                  A: Our support team typically responds within 24-48 hours. For urgent issues, please mark your email as "High Priority" or contact our hotline.
                </p>
              </div>
            </motion.div>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </motion.div>
  );
}
