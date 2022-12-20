import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import * as dotenv from 'dotenv'

import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/users.js"

dotenv.config()
const app = express()

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.get("/", (req,res) => {
    res.send("APP IS RUNNING")
})
app.use("/posts", postRoutes)
app.use("/user", userRoutes)


const PORT = process.env.PORT

// mongoose.set('strictQuery', true)
// mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => app.listen(PORT, () => console.log("Server ready to go")))
//     .catch((error) => console.log(error.message))

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> app.listen(PORT, () => console.log(`ready to go, port:${PORT}`)))
    .catch((error)=> console.log(error))

// mongoose.set("useFindAndModify", false)