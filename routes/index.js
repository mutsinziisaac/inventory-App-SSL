const express = require("express");
const router = express.Router();

const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");

/* GET home page. */
router.get("/", category_controller.index);

router.get("/categories", category_controller.category_list);

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get("/category/create", category_controller.category_create_get);

// POST request for creating Author.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete Author.
router.get("/categories/:id/delete", category_controller.category_delete_get);

// POST request to delete Author.
router.post("/categories/:id/delete", category_controller.category_delete_post);

// GET request to update Author.
router.get("/categories/:id/update", category_controller.category_update_get);

// POST request to update Author.
router.post("/categories/:id/update", category_controller.category_update_post);

// GET request for one Author.
router.get("/categories/:id", category_controller.category_detail);

module.exports = router;
