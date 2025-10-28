import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    condition: "",
    image: "",
  });

  // 🧠 fetch user’s books
  const fetchMyBooks = async () => {
    try {
      const res = await axios.get("https://bookswap-yi4i.onrender.com/api/books/my", {
        withCredentials: true,
      });
      setBooks(res.data);
    } catch (err) {
      toast.error("Failed to load your books");
      console.log(err);
      
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  // 📝 add new book
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://bookswap-yi4i.onrender.com/api/books", formData, {
        withCredentials: true,
      });
      toast.success("Book added successfully!");
      setFormData({ title: "", author: "", condition: "", image: "" });
      fetchMyBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding book");
    }
  };

  // ❌ delete a book
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://bookswap-yi4i.onrender.com/api/books/${id}`, {
        withCredentials: true,
      });
      toast.info("Book deleted");
      setBooks(books.filter((b) => b._id !== id));
    } catch (err) {
      toast.error("Failed to delete book");
      console.log(err);
      
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        My Books
      </h2>

      {/* Add Book Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto mb-10"
      >
        <h3 className="text-xl font-semibold mb-4 text-center">Add a Book</h3>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          required
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          name="condition"
          placeholder="Condition (e.g., Good, Like New)"
          value={formData.condition}
          onChange={(e) =>
            setFormData({ ...formData, condition: e.target.value })
          }
          required
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL (optional)"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Book
        </button>
      </form>

      {/* Books List */}
      <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book._id}
              className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition"
            >
              {book.image && (
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-xl font-semibold">{book.title}</h3>
              <p className="text-gray-600">Author: {book.author}</p>
              <p className="text-gray-500 text-sm">Condition: {book.condition}</p>
              <button
                onClick={() => handleDelete(book._id)}
                className="mt-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            You haven’t added any books yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyBooks;
