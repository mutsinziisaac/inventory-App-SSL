const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLenth: 25 },
  description: { type: String, required: true, maxLength: 100 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true, maxLength: 25 },
  number: { type: Number, required: true, maxLength: 25 },
});

ItemSchema.virtual("url").get(function () {
  return `/item/${this.id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
