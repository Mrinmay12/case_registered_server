
import {
    CreatPost,
    GetPost,
    UpdatePost,
    DeletePost,
    CreatOrder,
      getOrder,
      getCaseHistory,
      UpdateOrder,
      UpdateCaseStatus,
      Generate_Report,
      PerticulerPdf
    
  } from '../Controllers/PostController.js';
  import express from "express";
  import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
  const routes=express.Router()
  
    routes.get("/api/getpost",GetPost)
    routes.post("/api/uploadpost",CreatPost)
    routes.put("/api/updatepost",UpdatePost)
    routes.delete("/api/delete",DeletePost)
    routes.post('/api/create_order', upload.fields([{ name: 'Pdf' }]),CreatOrder)
    routes.get('/api/get_pdf/:id',PerticulerPdf)
    // routes.post("/api/create_order",CreatOrder)
    routes.put("/api/update_order",UpdateOrder)
    routes.get("/api/get_order",getOrder)
    routes.get("/api/get_case_history",getCaseHistory)
    routes.put("/api/update_case_status",UpdateCaseStatus)
    routes.get("/api/generate_reports",Generate_Report)

  

    
  


export default routes