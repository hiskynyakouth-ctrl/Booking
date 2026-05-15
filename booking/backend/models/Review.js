const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: "User",     required: true },
  business:   { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  booking:    { type: mongoose.Schema.Types.ObjectId, ref: "Booking",  default: null },
  rating:     { type: Number, min: 1, max: 5, required: true },
  comment:    { type: String, default: "" },
  reply:      { type: String, default: "" },   // business owner reply
  helpful:    { type: Number, default: 0 },
}, { timestamps: true });

// One review per user per business
reviewSchema.index({ user: 1, business: 1 }, { unique: true });

// Update business average rating after save
reviewSchema.post("save", async function () {
  const Business = mongoose.model("Business");
  const stats = await mongoose.model("Review").aggregate([
    { $match: { business: this.business } },
    { $group: { _id: "$business", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  if (stats.length) {
    await Business.findByIdAndUpdate(this.business, {
      rating:  Math.round(stats[0].avg * 10) / 10,
      reviews: stats[0].count,
    });
  }
});

module.exports = mongoose.model("Review", reviewSchema);
