import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from 'uuid';

import User from "../models/user.js"

export const signin = async (req,res) => {
    const { email, password } = req.body

    try {
        const existingUser = await User.findOne({email})

        if(!existingUser) return res.status(404).json({message: "User dosent exist"})

        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password)

        if(!isPasswordCorrect) return res.status(400).json({message:"invalid credentials"})

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, "ssdonshr", {expiresIn:"1h"})

        res.status(200).json({result:existingUser, token})
    } catch (error) {
        res.status(500).json({message:"something went wrong"})
    }
}

export const signup = async (req,res) => {
    const { email, password, firstName, lastName, confirmPassword } = req.body

    try {
        const existingUser = await User.findOne({ email: email })
        
        if(existingUser) return res.status(400).json({message:"User already exists"})

        if(password !== confirmPassword) return res.status(400).json({message:"Passwords dont match"})
        
        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await User.create({
            name: `${firstName} ${lastName}`,
            email, 
            password: hashedPassword, 
            id: uuidv4()
        })
        
        console.log("result")
        console.log(result)

        const token = jwt.sign({email:result.email, id:result.id}, "ssdonshr", {expiresIn: "1h"})

        res.status(200).json({result, token})
    } catch (error) {
        res.status(500).json({message:"Something went wrong"})
    }
}