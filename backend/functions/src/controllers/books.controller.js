import * as BookService from "../services/books.service.js";

// GET all Books - with filters
export const getBooks = async (req, res) => {
  try {
    const { titulo, autor, estado } = req.query
    const books = await BookService.getBooks({ titulo, autor, estado });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET Book by ID
export const getBooksById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BookService.getBookById(id);
    res.json(book);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// POST new Book
export const postBook = async (req, res) => {
  try {
    const newBook = await BookService.createBook(req.body);
    res.status(201).json({ msg: "Libro agregado correctamente", newBook });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT Books
export const putBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await BookService.updateBook(id, req.body);
    res.json({ msg: "Libro actualizado correctamente", updatedBook });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// DELETE Book
export const deleteBooks = async (req, res) => {
  try {
    const { id } = req.params;
    await BookService.deleteBook(id);
    res.json({ msg: "Libro eliminado correctamente" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const reservarLibro = async (req, res) => {
  try {
    const {id} = req.params
    const idLibro = id
    const {idSocio} = req.body

    if (!idLibro) {
      return res.json({error: "id del libro es obligatorio"})
    }

    if (!idSocio) {
      return res.json({error: "id del socio es obligatorio"})
    }
    
    const reserva = await BookService.postReserva({idLibro, idSocio})
    return res.json(reserva)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}


export const renounceLoanReserv = async (req, res) => {
  try {
    const {idBooking} = req.params

    if (!idBooking) {
      return res.status(400).json({error: "El ID de la Reserva es obligatorio"})
    }

    const renuncia = await BookService.renounceLoan(idBooking)
    res.json(renuncia)  
  } catch (error) {
    res.status(400).json({error: error.message})
  }
} 