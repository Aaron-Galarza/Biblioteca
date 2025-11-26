import express from "express";
import { getBooks,
    getBooksById,
    postBook,
    putBook,
    deleteBooks,
    reservarLibro,
    renounceLoanReserv
} from "../controllers/books.controller.js";

import { verifyToken, isAdmin, isUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBooksById);

router.post("/", verifyToken, isAdmin, postBook);                                   // Protected route (Admin)
router.put("/:id", verifyToken, isAdmin, putBook);                                  // Protected route (Admin)
router.delete("/:id", verifyToken, isAdmin, deleteBooks);                           // Protected route (Admin)

router.post("/:id/booking", verifyToken, isAdmin, reservarLibro)                    // Protected route (User)
router.post("/:idBooking/cancel", verifyToken, isUser, renounceLoanReserv)          // Protected route (User)

export default router;