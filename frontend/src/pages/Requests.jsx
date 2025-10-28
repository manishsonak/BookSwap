import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const Requests = () => {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchRequests = async () => {
    if (!user) return;

    try {
      const resReceived = await axios.get("http://localhost:5000/api/requests/received", {
        withCredentials: true,
      });

      const filteredReceived = resReceived.data.filter(
        (req) => req.requester._id !== user._id
      );
      setReceived(filteredReceived);

      const resSent = await axios.get("http://localhost:5000/api/requests/sent", {
        withCredentials: true,
      });
      setSent(resSent.data);
    } catch (err) {
      toast.error("Failed to load requests");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleAction = async (id, action) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/requests/${id}`,
        { status: action },
        { withCredentials: true }
      );
      toast.success(`Request ${action}ed successfully!`);
      fetchRequests();
    } catch (err) {
      toast.error("Failed to update request");
      console.log(err);
    }
  };

  const RequestCard = ({ req, type }) => (
    <div className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition flex flex-col">
      {/* Book Image */}
      {req.book?.image && (
        <img
          src={req.book.image}
          alt={req.book.title}
          className="w-full h-48 object-cover rounded mb-3"
        />
      )}

      <h3 className="text-xl font-semibold mb-2">{req.book?.title}</h3>

      {type === "received" ? (
        <>
          <p className="text-gray-600">From: {req.requester?.name}</p>
          <p className="text-gray-600">To: {req.book?.user?.name}</p>
        </>
      ) : (
        <p className="text-gray-600">Requested To: {req.book?.user?.name}</p>
      )}

      <p className="text-sm text-gray-500 mt-1">
        Status:{" "}
        <span
          className={`font-semibold ${
            req.status === "accepted"
              ? "text-green-600"
              : req.status === "declined"
              ? "text-red-500"
              : "text-yellow-600"
          }`}
        >
          {req.status}
        </span>
      </p>

      {/* Accept / Decline buttons for received requests */}
      {type === "received" && req.status === "pending" && (
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => handleAction(req._id, "accepted")}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          >
            Accept
          </button>
          <button
            onClick={() => handleAction(req._id, "declined")}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Book Requests
      </h2>

      {/* Received Requests */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-blue-500">Received Requests</h3>
        <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
          {received.length > 0 ? (
            received.map((req) => <RequestCard key={req._id} req={req} type="received" />)
          ) : (
            <p className="text-gray-500 col-span-full">No received requests.</p>
          )}
        </div>
      </div>

      {/* Sent Requests */}
      <div>
        <h3 className="text-2xl font-semibold mb-4 text-green-500">Sent Requests</h3>
        <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
          {sent.length > 0 ? (
            sent.map((req) => <RequestCard key={req._id} req={req} type="sent" />)
          ) : (
            <p className="text-gray-500 col-span-full">No sent requests.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;
