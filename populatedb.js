#! /usr/bin/env node

console.log(
  "This script populates some test items and categories to your database."
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(name, description) {
  const category = new Category({ name, description });
  await category.save();
  categories.push(category);
  console.log(`Added category: ${name}`);
}

async function itemCreate(name, description, category, price, number) {
  const itemDetail = {
    name,
    description,
    category,
    price,
    number,
  };
  const item = new Item(itemDetail);
  await item.save();
  items.push(item);
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate("Electronics", "Electronic gadgets and devices"),
    categoryCreate("Clothing", "Apparel and fashion accessories"),
    categoryCreate("Books", "Literary works in various genres"),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(
      "Smartphone",
      "High-end smartphone with advanced features",
      categories[0],
      899.99,
      50
    ),
    itemCreate(
      "Laptop",
      "Powerful laptop for productivity and gaming",
      categories[0],
      1299.99,
      20
    ),
    itemCreate(
      "T-shirt",
      "Casual cotton T-shirt for everyday wear",
      categories[1],
      19.99,
      100
    ),
    itemCreate(
      "Jeans",
      "Comfortable denim jeans for all occasions",
      categories[1],
      39.99,
      50
    ),
    itemCreate(
      "Science Fiction Book",
      "Exciting tales from the future and beyond",
      categories[2],
      24.99,
      30
    ),
    itemCreate(
      "Cookbook",
      "Recipes and culinary delights for every chef",
      categories[2],
      29.99,
      40
    ),
  ]);
}
