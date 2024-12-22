// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoyiK9cGUlAZWNiwFlXfcWqpUXjl6loO0",
  authDomain: "expensive-login.firebaseapp.com",
  projectId: "expensive-login",
  storageBucket: "expensive-login.firebasestorage.app",
  messagingSenderId: "180035647875",
  appId: "1:180035647875:web:01301d1298982b50ed1eb6"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app); 


var newbtn= document.getElementById("btn1")
newbtn.addEventListener("click",fun1)
function fun1(){
  var username=document.getElementById("signupUsername").value;
  var password=document.getElementById("signupPassword").value;
  var email=document.getElementById("signupEmail").value;
  console.log(username,password,email)

  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log("User signed up:", user);
    alert("Signup successful!");
    window.location.href="login.html";
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Signup error", errorCode, errorMessage);
    alert(`Signup failed: ${errorMessage}`);
  });
}

var newbtn2= document.getElementById("btn2")
newbtn2.addEventListener("click",fun2)

function fun2(){
  var email=document.getElementById("loginEmail").value;
  var password=document.getElementById("loginPassword").value;
  console.log(email,password)

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("User logged in:", user);
      window.location.href="main.html";
      // alert("Login successful!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Login error", errorCode, errorMessage);
      alert(`Login failed: ${errorMessage}`);
    });
}