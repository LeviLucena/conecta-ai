<p align="center">

  <!-- Framework -->
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  </a>

  <!-- Backend -->
  <a href="https://firebase.google.com/">
    <img src="https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" />
  </a>

  <!-- UI Library -->
  <a href="https://ui.shadcn.com/">
    <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
  </a>

  <!-- Styling -->
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </a>

  <!-- Language -->
   <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>

  <!-- License -->
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT License" />

</p>

![logo-conectaai](https://github.com/user-attachments/assets/544769c9-daf8-4110-a0c7-4aae26017df1)

# Conecta Aí with Firebase Studio

This is a NextJS application built with Firebase Studio. It is a communication application with features for chatting, calling, managing contacts, and user settings. The application leverages Firebase services for the backend and uses shadcn/ui for the UI components.

## Features

- **Chatting:** Real-time messaging between users.
- **Calling:** Voice and video calls.
- **Contact Management:** Add, view, and manage contacts.
- **User Settings:** Configure user preferences and profile information.

To get started, take a look at src/app/page.tsx.

https://github.com/user-attachments/assets/ae1d4acc-5bbd-4d86-a8d4-a1c90d176d7e

| ![pagina inicial](https://github.com/user-attachments/assets/4721e35e-5233-4422-8cb1-6721feafc6cb) | ![image](https://github.com/user-attachments/assets/6bf73b8d-fe72-4c8c-abac-40b20151051e) | ![image](https://github.com/user-attachments/assets/b5fb4ec2-891c-445d-85b0-85466400a114) | ![image](https://github.com/user-attachments/assets/23a387d2-b122-4aea-9418-aa65506ffeb5) |
| --- | --- | --- | --- |
| ![image](https://github.com/user-attachments/assets/80d39b05-caba-425e-832b-9e84f68133a3) | ![image](https://github.com/user-attachments/assets/6c15f4da-22a2-4b5f-88cb-4bd8f9c9f938) | ![image](https://github.com/user-attachments/assets/925d0c14-4de1-4aac-907b-49669fecdded) | ![image](https://github.com/user-attachments/assets/cb9251b5-6246-49e3-b2a6-74304e520732) |

## Technologies

- **Next.js:** React framework for server-side rendering and static site generation.
- **Firebase Studio:** Integrated development environment for building Firebase applications.
- **Firebase:** Backend-as-a-Service (BaaS) providing authentication, database, storage, and more.
- **shadcn/ui:** UI component library based on Radix UI and Tailwind CSS.
- **Tailwind CSS:** Utility-first CSS framework.

## Setup and Running Locally

Follow these steps to set up and run the application on your local machine:

1. **Clone the repository:**
```
git clone https://github.com/LeviLucena/conecta-ai.git
cd <nome do repositório>
```
2. **Install dependencies:** 
Use npm or yarn to install the project dependencies:
```bash
npm install
    # or
    yarn install
```
3. **Set up Firebase:**

- Create a new project in the Firebase console (https://console.firebase.google.com/).
- Enable the necessary services (Authentication, Firestore, etc.).
- Get your Firebase configuration object.
- Create a .env.local file in the root of the project and add your Firebase configuration as environment variables (refer to the application's code for expected variable names, e.g., NEXT_PUBLIC_FIREBASE_API_KEY).

4. **Run the development server:**
Start the Next.js development server:
```bash
npm run dev
    # or
    yarn dev
```
The application should now be running at http://localhost:3000.

## 🤝 Contributions
Feel free to contribute, suggest improvements, or report issues to help develop this project.

## 📄 License
This project is licensed under the MIT License — see [LICENSE](https://github.com/github/gitignore/blob/main/LICENSE) for details.
