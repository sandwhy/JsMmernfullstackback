import mongoose from "mongoose"
import PostMessage from "../models/postMessage.js"

export const getPosts = async (req,res) =>{
    const {page} = req.query
    try {
        const LIMIT = 6
        const startIndex = (Number(page) -1) * LIMIT
        // console.log(page)
        // console.log(startIndex)
        const total = await PostMessage.countDocuments({})
        // console.log("here")
        // console.log(total)
        const posts = await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex)
        // console.log(posts)

        res.status(200).json({data:posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT)})
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}

export const getPost = async (req,res) => {
    const { id } = req.params
    
    try {
        const post = await PostMessage.findById(id)

        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const commentPost = async( req, res ) => {
    console.log("being executed")
    const { id } = req.params
    const { value } = req.body

    const post = await PostMessage.findById(id)

    post.comments.push(value)

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true})

    res.json(updatedPost)
}

export const getPostsBySearch = async (req,res) => {
    const {searchQuery, tags} = req.query

    try {
        const title = new RegExp(searchQuery,"i")
        // const posts = null
        const posts = await PostMessage.find({ $or: [ {title}, {tags: {$in: tags.split(",")} }] })

        res.json({data: posts})
    } catch (error) {
        res.status(404).json({ message: error.message})
    }
}

export const createPost = async (req,res) => {
    const post = req.body
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()})
    try {
        await newPost.save()
        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({message: error.message})
    }
}

export const updatePost = async (req,res) => {
    console.log("doing here")
    const {id: _id} = req.params
    console.log(_id)
    const post = req.body
    console.log(post)

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send("No posts witht that id")
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, {new:true})

    res.json(updatePost)
}

export const deletePost = async (req,res) => {
    const { id } = req.params
    // console.log("hello")
    // console.log(id)
    if(!mongoose.Types.ObjectId.isValid(id)){ 
        console.log('tis here now')
        return res.status(404).send("No post with that id")
    }
    // console.log("over here then")
    await PostMessage.findByIdAndRemove(id)

    res.json({message: "Post deleted successfully"})
}

export const likePost = async (req,res) => {
    const {id} = req.params

    if(!req.userId) return res.json({message: "Unauthenticated"})

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send("No posts witht that id")
    }

    const post = await PostMessage.findById(id)
    // console.log(post)
    const index = post.likes.findIndex((id) => id === String(req.userId))

    if(index === -1) {
        post.likes.push(req.userId)
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new:true})
    // console.log(updatedPost)
    res.json(updatedPost)
}