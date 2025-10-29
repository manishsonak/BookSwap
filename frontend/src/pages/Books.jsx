import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("https://bookswap-yi4i.onrender.com/api/books", {
          withCredentials: true,
        });
        setBooks(res.data);
      } catch (err) {
        toast.error("Failed to load books");
        console.log(err);
      }
    };

    const fetchRequests = async () => {
      if (!user) return;
      try {
        const res = await axios.get("https://bookswap-yi4i.onrender.com/api/requests/sent", {
          withCredentials: true,
        });
        setRequests(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBooks();
    fetchRequests();
  }, [user]);

  const handleRequest = async (bookId) => {
    try {
      await axios.post(
        "https://bookswap-yi4i.onrender.com/api/requests",
        { bookId },
        { withCredentials: true }
      );
      toast.success("Request sent!");
      
      setRequests((prev) => [...prev, { book: { _id: bookId } }]);
    } catch (err) {
      
      if (err.response?.data?.msg === "Request already sent") {
        setRequests((prev) => [...prev, { book: { _id: bookId } }]);
      }
      toast.error(err.response?.data?.msg || "Failed to send request");
      console.log(err);
    }
  };

  
  const isRequested = (bookId) => {
    return requests.some((req) => req.book._id === bookId);
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Available Books
      </h2>

      <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book._id}
              className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{book.title}</h3>
              <p className="text-gray-600">Author: {book.author}</p>
              <p className="text-gray-500 text-sm mt-2">{book.description}</p>
              <p className="text-sm mt-3 font-semibold">
                Owner: {book.user?.name || "Unknown"}
              </p>

              {/* Request button only if not already requested */}
              {!isRequested(book._id) && user ? (
                <button
                  onClick={() => handleRequest(book._id)}
                  className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Request
                </button>
              ) : (
                <span className="mt-3 text-green-600 font-semibold block">
                  Already requested
                </span>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No books available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Books;
