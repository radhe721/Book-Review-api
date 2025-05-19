const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

// Create a review
router.post('/books/:bookId/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const bookId = req.params.bookId;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      book: bookId,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    // Create review
    const review = new Review({
      book: bookId,
      user: req.user._id,
      rating,
      comment
    });

    await review.save();

    // Update book's average rating and total reviews
    const allReviews = await Review.find({ book: bookId });
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    book.averageRating = totalRating / allReviews.length;
    book.totalReviews = allReviews.length;
    await book.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a review
router.put('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    const { rating, comment } = req.body;
    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Update book's average rating
    const book = await Book.findById(review.book);
    const allReviews = await Review.find({ book: review.book });
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    book.averageRating = totalRating / allReviews.length;
    await book.save();

    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.deleteOne({ _id: review._id });

    // Update book's average rating and total reviews
    const book = await Book.findById(review.book);
    const allReviews = await Review.find({ book: review.book });
    
    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
      book.averageRating = totalRating / allReviews.length;
    } else {
      book.averageRating = 0;
    }
    
    book.totalReviews = allReviews.length;
    await book.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 