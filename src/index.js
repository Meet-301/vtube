import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";

const 

( () => {
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    } catch (error) {
        console.error("Error: ", error)
    }
} )()