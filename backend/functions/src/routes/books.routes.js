import express from "express";
import { getBooks, getBooksById, postBook, putBook, deleteBooks } from "../controllers/books.controller.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBooksById);
router.post("/", postBook);
router.put("/:id", putBook);
router.delete("/:id", deleteBooks);

export default router;