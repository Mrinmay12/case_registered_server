
import {
    Creatuser,
    Login,
    verifyTokenAndUser,
    LoginNext
  } from '../Controllers/UserController.js';
  import express from "express";
  const routes=express.Router()
  
    routes.post("/register",Creatuser)
    routes.post("/login",Login)  
    routes.post("/loginnext",LoginNext)  
    routes.get("/verifytoken", verifyTokenAndUser);
  


export default routes