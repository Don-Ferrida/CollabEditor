# Real-Time Document Collaboration App

_COMPANY_: CODTECH IT SOLUTIONS

_NAME_: DON FERRIDA D

_INTERN ID_: CT04DG3262

_DOMAIN_: FULL STACK WEB DEVELOPMENT

_DURATION_: 4 WEEKS

_MENTOR_: NEELA SANTOSH

# CollabEditor

This project is a real-time document collaboration platform that allows users to create, edit, and collaborate on documents with others seamlessly. Built using the MERN stack and powered by Socket.IO, this app provides an intuitive and interactive editing experience much like Google Docs.

# Features

> User Authentication with Firebase

> Create, edit, and delete documents

> Real-time collaboration using Socket.IO

> Add and manage document collaborators

> Personal document dashboard

> Access control: only collaborators can edit documents

> Backend API with secure JWT-based auth

# Project Objectives

> Understand and implement real-time communication using WebSockets.

> Build a collaborative document editing interface.

> Implement secure authentication and authorization.

> Explore full-stack development with a focus on user experience.

> Manage user-specific documents and control sharing.

# How It Works

**User Authentication**: Users sign up or log in using email and password. On successful login, a JWT token is stored in the browser for session management.

**Dashboard**: Once logged in, users are redirected to a dashboard where they can:

1. Create new documents

2. View a list of existing documents

3. Click on a document to open it in the editor

**Document Editor**:

1. Users can edit the content using a basic text editor.

2. Every edit is auto-saved to the database, ensuring content is not lost.

3. Collaborators added to the document can also access it from their dashboard.

**Collaboration**:

1. Users can share a document with other registered users by entering their email.

2. The backend checks if the email exists and updates the document’s collaborators list.

3. Shared users can then edit the document via their own dashboard.

**Logout**:A logout button is placed on the top-right, which clears local storage and redirects the user back to the login page.

# Integrations & Technologies Used

> MongoDB & Mongoose – for database and schema modeling

> Express.js – for routing and backend logic

> Node.js – as the backend runtime

> React.js – for building the frontend

> React Router – for client-side navigation

> JWT (jsonwebtoken) – for secure authentication

> Axios – for making HTTP requests

> React Modal – for modal components like Add Collaborator

> CSS Flexbox/Grid – for layout and styling

# Tech Stack

**Frontend**:

1. React.js

2. HTML, CSS

3. React Router

4. Axios

**Backend**:

1. Node.js

2. Express.js

3.MongoDB with Mongoose

4. JWT for authentication

# Installation Guide

To run this project locally:

1. **Clone the repository**

git clone https://github.com/yourusername/document-collab-app.git

cd document-collab-app

2. **Install backend dependencies**

cd server

npm install

npm start

3. **Install frontend dependencies**

cd collaborative-editor

npm install

npm start

4. Make sure MongoDB is running on your machine or provide a connection URI in the .env file (e.g., MONGO_URI=your_mongodb_url).

# Screenshots

![img](https://github.com/user-attachments/assets/03e0763f-62b6-4d14-a74a-50b90542a73a)

![img](https://github.com/user-attachments/assets/15787e3b-d8fb-4ea2-bc7a-f6fa3d2f86e2)

![img](https://github.com/user-attachments/assets/b37b922c-657b-4002-8268-78a909ce0ebe)

![img](https://github.com/user-attachments/assets/fdab5856-4ab8-4fa8-aa28-507aaa6f4778)

![img](https://github.com/user-attachments/assets/640b36e1-09f0-4bf4-952b-b97a2a5c4da8)

![img](https://github.com/user-attachments/assets/77635135-95a9-4146-9f01-8a73ec8e6bd1)

![img](https://github.com/user-attachments/assets/063ef559-74ba-4dde-90f1-c38cde5a5cb0)

![img](https://github.com/user-attachments/assets/70c3ba97-1878-4ffd-86ad-0f78b4fa0b34)

![img](https://github.com/user-attachments/assets/c7836b4e-e572-472d-b1e9-cddf129692ac)

![img](https://github.com/user-attachments/assets/441a3858-7178-4f73-9fc6-7635a424a323)

# What I Learned

> The importance of modular architecture in both frontend and backend development

> How to structure a full-stack project using React and Node

> Hands-on practice with JWT-based authentication and handling user sessions securely

> Handling state and props effectively in React to build dynamic UIs

> Building and protecting API routes for authorized access only

> Implementing collaborator logic, such as checking if the email exists and preventing duplicates

> Debugging errors related to CORS, missing data, and async functions

> Learned how to use React Modal and how accessibility settings like appElement are important for screen readers

# Improvements & Future Enhancements

> Add real-time sync using Socket.io so collaborators can see changes live

> Implement role-based permissions (viewer/editor access levels)

> Enable version history and document recovery

> Add notifications for document shares

> Improve mobile responsiveness for smaller devices

> Add unit tests for backend APIs and key frontend components

## License

This project is free to use for educational purposes and internships.

---

## About the Author

Built with curiosity, creativity, and a love for clean interfaces.  
Feel free to fork the repo or reach out with suggestions!
