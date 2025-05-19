const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Create a new book (authenticated)
router.post('/', auth, async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all books with pagination and filters
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.author) query.author = req.query.author;
    if (req.query.genre) query.genre = req.query.genre;

    const books = await Book.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(query);

    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search books
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchRegex = new RegExp(query, 'i'); // 'i' flag for case-insensitive
    const books = await Book.find({
      $or: [
        { title: searchRegex },
        { author: searchRegex }
      ]
    }).limit(10);

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get book by ID with reviews
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ book: book._id })
      .populate('user', 'username')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalReviews = await Review.countDocuments({ book: book._id });

    res.json({
      book,
      reviews,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit),
      totalReviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router; 