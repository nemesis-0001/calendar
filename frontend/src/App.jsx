import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LoginForm from "./components/Login/LoginForm";
import Register from "./components/Login/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home/Home";
import auth from "../src/components/Login/firebase";
import { ToastContainer } from "react-toastify";
import Basic from "./components/Home/Calender";
import MyCalendar from "./components/Home/Calender";

function App() {
  // const [count, setCount] = useState(0);
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });
  const userId = auth.currentUser?.uid;
  console.log("User ID:", userId);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <LoginForm />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          {/* <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold text-center mb-4">
              My Event Calendar
            </h1> */}
          <Route path="/calender" element={<MyCalendar userId={userId} />} />
          {/* </div> */}
        </Routes>
        <ToastContainer />
      </Router>
      {/* <LoginForm /> */}
    </>
  );
}

export default App;