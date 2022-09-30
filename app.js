const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const Blog = require("./models/blog")

// express app
const app = express()

// connect to mongodb & listen for requests
const dbURI =
  "mongodb+srv://Test:123556645623qss@cluster0.cllantg.mongodb.net/node-tuts?retryWrites=true&w=majority"

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err))

// register view engine
app.set("view engine", "ejs")

// middleware & static files
app.use(express.static("publicc"))
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))
app.use((req, res, next) => {
  res.locals.path = req.path
  next()
})

// mongoose & mongo tests

app.get("/", (req, res) => {
  res.redirect("/blogs")
})

app.get("/about", (req, res) => {
  res.render("about", { title: "About" })
})

app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a new blog" })
})
app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { blogs: result, title: "All blogs" })
    })
    .catch((err) => {
      console.log(err)
    })
})
app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body)
  blog
    .save()
    .then((result) => res.redirect("/blogs"))
    .catch((err) => console.log(err))
})

// blog routes
app.get("/blogs/:id", (req, res) => {
  const id = req.params.id
  Blog.findById(id)
    .then((result) => {
      res.render("details", { blog: result, title: "Blog details" })
    })
    .catch((err) => console.log(err))
})

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id

  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/blogs" })
    })
    .catch((err) => {
      console.log(err)
    })
})
// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" })
})
