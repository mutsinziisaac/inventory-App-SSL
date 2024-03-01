const Category = require("../models/Category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const [numCategories, numItems] = await Promise.all([
    Category.countDocuments({}).exec(),
    Item.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "home",
    category_count: numCategories,
    item_count: numItems,
  });
});

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("category_list", {
    title: "all categories",
    category_list: allCategories,
  });
});

// Display detail page for a specific Author.
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, allItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);

  if (category === null) {
    // No results.
    const err = new Error("category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    category: category,
    allItems: allItems,
  });
});

// Display Author create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
});

// Handle Author create on POST.
exports.category_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("name must be specified")
    .isAlphanumeric()
    .withMessage("has non alphanumeric characters"),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("descrition must be specified")
    .isAlphanumeric()
    .withMessage("has non alphanumeric characters"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "create catalog",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      await category.save();
      res.redirect(category.url);
    }
  }),
];

// Display Author delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);

  if (category === null) {
    // No results.
    res.redirect("/catagories");
  }

  res.render("category_delete", {
    title: "Delete category",
    category: category,
    items: items,
  });
});

// Handle Author delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  await Item.deleteMany({ category: req.params.id }),
    await Category.findByIdAndDelete(req.params.id);
  res.redirect("/categories");
});

// Display Author update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    const err = new Error("author not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", {
    title: "update Category",
    category: category,
  });
});

// Handle Author update on POST.
exports.category_update_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("name must be specified"),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("descrition must be specified"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "create catalog",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      await Category.findByIdAndUpdate(req.params.id, category);
      res.redirect(category.url);
    }
  }),
];
