import Request from "../models/requestModel.js";
import Book from "../models/bookModel.js";

// 🟢 Send a book request
export const sendRequest = async (req, res) => {
  const { bookId } = req.body;

  if (!bookId) return res.status(400).json({ msg: "Book ID is required" });

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ msg: "Book not found" });

    // Prevent requesting your own book
    if (book.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ msg: "Cannot request your own book" });
    }

    // Check if request already exists
    const existing = await Request.findOne({
      requester: req.user._id,
      book: bookId,
    });
    if (existing) return res.status(400).json({ msg: "Request already sent" });

    const request = await Request.create({
      requester: req.user._id,
      book: bookId,
    });

    res.status(201).json({ msg: "Request sent successfully", request });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// 🟢 Get requests sent by the logged-in user
export const getSentRequests = async (req, res) => {
  try {
  // Fetch all requests made by the logged-in user
  
 const requests = await Request.find({ requester: req.user._id })
  .populate('requester', 'name email')          // Requester info
  .populate({
    path: 'book',                               // Pehle book populate karo
    select: 'title author condition image',
    populate: {                                 // Uske andar user populate karo
      path: 'user',
      select: 'name email'
    }
  });

    
    // Book owner ka name & email

  res.json(requests);
} catch (error) {
  console.error("Error fetching requests:", error);
  res.status(500).json({ msg: error.message });
}

};

// 🟢 Get requests received for the logged-in user’s books
export const getReceivedRequests = async (req, res) => {
  try {
     const requests = await Request.find()
      .populate({
        path: "book",
        match: { user: req.user._id }, // Only books owned by current user
        select: "title author condition image user",
        populate: { path: "user", select: "name email" }, // populate book owner
      })
      .populate("requester", "name email");

    // Filter out requests not belonging to user's books
    const filtered = requests.filter((r) => r.book !== null);

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// 🟢 Update request status (accept/decline)
export const updateRequestStatus = async (req, res) => {
  const { status } = req.body; // expected: "accepted" or "declined"
  const { id } = req.params;

  if (!["accepted", "declined"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status" });
  }

  try {
    const request = await Request.findById(id).populate("book");
    if (!request) return res.status(404).json({ msg: "Request not found" });

    // Only book owner can update the status
    if (request.book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized to update this request" });
    }

    request.status = status;
    await request.save();

    res.json({ msg: "Request status updated", request });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
