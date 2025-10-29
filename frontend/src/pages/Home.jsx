import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("https://bookswap-yi4i.onrender.com/api/books", {
          withCredentials: true,
        });
        setBooks(res.data.slice(0, 6)); 
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
    return requests.some((req) => req.book?._id === bookId);
  };

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="text-center py-16 bg-blue-50 rounded-lg shadow-md">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-700">
          Welcome to BookSwap 📚
        </h1>
        <p className="text-gray-600 mb-6">
          Buy, sell, or exchange books easily with our community.
        </p>
        <div className="flex justify-center gap-4">
          {!user && (
            <>
              <a
                href="/signup"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Signup
              </a>
              <a
                href="/login"
                className="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-100 transition"
              >
                Login
              </a>
            </>
          )}
        </div>
      </section>

      {/* Featured Books */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-700">
          Featured Books
        </h2>
        {books.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition flex flex-col justify-between"
              >
                {/* Book Image */}
                {book.image && (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                )}

                <div>
                  <h3 className="text-xl font-semibold">{book.title}</h3>
                  <p className="text-gray-600 mt-1">Author: {book.author}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {book.description?.slice(0, 80)}...
                  </p>
                  <p className="text-sm mt-3 font-semibold">
                    Owner: {book.user?.name || "Unknown"}
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  {/* Request Button */}
                  {user && !isRequested(book._id) && (
                    <button
                      onClick={() => handleRequest(book._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                    >
                      Request
                    </button>
                  )}

                  {isRequested(book._id) && (
                    <span className="text-green-600 font-semibold text-center">
                      Already requested
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No books available.</p>
        )}
      </section>
    </div>
  );
}
