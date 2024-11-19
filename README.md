# Expense Tracker Application  

This is a **React-based Expense Tracker Application** designed to help users manage their expenses efficiently. The application features secure user authentication and data storage powered by **Firebase**.  

## Key Features  

- **User Authentication**: Seamlessly login and register functionality integrated with Firebase Authentication.  
- **Expense Tracking**: Add, view, and categorize expenses for better financial management.  
- **Database Integration**: Securely store and retrieve expense data using Firebase Realtime Database or Firestore.  

---

## Prerequisites  

Before running the application, ensure you have the following installed:  
- [Node.js](https://nodejs.org/)  
- [npm](https://www.npmjs.com/)  

---

## Installation & Setup  

Follow these steps to run the application:  

1. **Clone the Repository**  
   ```bash  
   git clone <repository-url>  
   cd <repository-directory>  
   ```  

2. **Install Dependencies**  
   Run the following command to install all required dependencies:  
   ```bash  
   npm install  
   ```  

3. **Start the Application**  
   Launch the application with:  
   ```bash  
   npm start  
   ```  

4. Open the app in your browser at `http://localhost:3000`.  

---

## Firebase Integration  

The file used to integrate **Firebase Authentication** and the **Database** with the React frontend (`firebase.js`) is excluded from this repository for security purposes. It is listed in the `.gitignore` file.  

To integrate Firebase, create a `firebase.js` file in the project directory and add your Firebase configuration:  

```javascript  
// firebase.js  
import firebase from 'firebase/app';  
import 'firebase/auth';  
import 'firebase/database';  

const firebaseConfig = {  
  apiKey: "YOUR_API_KEY",  
  authDomain: "YOUR_AUTH_DOMAIN",  
  projectId: "YOUR_PROJECT_ID",  
  storageBucket: "YOUR_STORAGE_BUCKET",  
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  
  appId: "YOUR_APP_ID"  
};  

firebase.initializeApp(firebaseConfig);  

export const auth = firebase.auth();  
export const database = firebase.database();  
export default firebase;  
```  

---

## Security Note  

Ensure that sensitive information such as API keys and Firebase configuration details are not exposed in your codebase. Use environment variables (`.env`) to securely manage such information.  

---

## Contributing  

Contributions are welcome! Feel free to fork this repository and submit a pull request with your enhancements or bug fixes.  

---

## License  

This project is licensed under the [MIT License](./LICENSE).  

---

### Author  

Developed by **Shradha Wangota**  
