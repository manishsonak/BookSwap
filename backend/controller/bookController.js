import Book from "../models/bookModel.js";


export const addBook = async (req, res) => {
  const { title, author, condition, image } = req.body;
  if (!title || !author || !condition)
    return res.status(400).json({ msg: "All fields are required" });

  try {
    const newBook = await Book.create({
      user: req.user._id,
      title,
      author,
      condition,
      image,
    });

    res.status(201).json({ msg: "Book added successfully", book: newBook });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: { $ne: req.user._id } }).populate(
      "user",
      "name email"
    );
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: "Book not found" });

    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized to delete this book" });
    }

    await book.deleteOne();
    res.status(200).json({ msg: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
