import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import Post from "../Models/PostModel.js"
import mongoose from 'mongoose';
import admin from 'firebase-admin';
import Firebaseservice from "../Controllers/Firebase/Firebase.js";
import path from 'path';
import Url from '../Models/DownloadUrl.js';
admin.initializeApp({
    credential: admin.credential.cert(Firebaseservice),
    storageBucket: 'gs://product-f0aa0.appspot.com',
});
const bucket = admin.storage().bucket();
const csvWriter = createCsvWriter({
    path: 'output.csv',
    header: [
      { id: 'case_no', title: 'CASE NO' },
      { id: 'case_tittle', title: 'CASE TITTLE' },
      { id: 'case_date', title: 'CASE DATE' },
      { id: 'sdem_name', title: 'SDEM NAME' },
    ],
  });

 export async function exportDataToCSV() {
    try {
      const data = await Post.find().limit(100000).lean(); 
  
      // Write data to CSV file
      await csvWriter.writeRecords(data);
      console.log('CSV file was written successfully.');
      await uploadFileToFirebase('output.csv');
   
    } catch (error) {
      console.error('Error writing to CSV file:', error);
    } finally {
    //   mongoose.connection.close();
    }
  }

  //upload url
  const UploadUrl=async(url)=>{
    try{
    let data=await Url.find({})
    if(data.length===0){
      let data=  new Url({
            url:url
        })
        await data.save()
    }else{
        data.url=url
        await data.save()
    }
    
    }catch(err){

    }
  }

async function uploadFileToFirebase(localFilePath) {
    try {
      
        const remoteFilePath = path.basename(localFilePath); 

        await bucket.upload(localFilePath, {
            destination: remoteFilePath,
            metadata: {
                contentType: 'text/csv',
            },
        });


        const file = bucket.file(remoteFilePath);
        
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-09-2491' 
        });

        console.log(`File ${localFilePath} uploaded to Firebase Storage as ${remoteFilePath}.`);
       await UploadUrl(url)
        console.log(`Download URL: ${url}`);
        
    } catch (error) { 
        console.error('Error uploading file to Firebase Storage:', error);
    }
}

  
