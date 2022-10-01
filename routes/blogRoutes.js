const express = require("express")
const router = express.Router()
const Blog = require("../models/blog")
const blogController = require("../controllers/blogController")

router.get("/", blogController.blog_index)
router.post("/", blogController.blog_create_post)
router.get("/create", blogController.blog_create_get)
router.get("/:id", blogController.blog_id_get)
router.delete("/:id", blogController.blog_id_delete)

module.exports = router
