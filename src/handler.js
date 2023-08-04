const { nanoid } = require('nanoid');
const books = require('./books');

const addABookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const insertedAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const newbook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newbook);
  const Success = books.filter((book) => book.id === id).length > 0;

  if (Success) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal di tambahkan',

  });
  response.code(500);
  return response;
};

const getEntireBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let StackedBook = books;

  if (reading !== undefined) {
    StackedBook = StackedBook.filter((book) => book.reading === !!Number(reading));
  }
  if (finished !== undefined) {
    StackedBook = StackedBook.filter((book) => book.finished === !!Number(finished));
  }
  if (name !== undefined) {
    StackedBook = StackedBook.filter((book) => book.name.toLowerCase()
      .includes(name.toLowerCase()));
  }
  if (reading === '1') {
    StackedBook = StackedBook.filter((book) => Number(book.reading) === Number(reading));
  }
  const response = h.response({
    status: 'success',
    data: {
      books: StackedBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const GetSpecificBook = (request, h) => {
  const { id } = request.params;
  const book = books.filter((b) => b.id === id)[0];

  if (book === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);

    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      book: {
        id: book.id,
        name: book.name,
        year: book.year,
        author: book.author,
        summary: book.summary,
        publisher: book.publisher,
        pageCount: book.pageCount,
        readPage: book.readPage,
        finished: book.finished,
        reading: book.reading,
        insertedAt: book.insertedAt,
        updatedAt: book.updatedAt,
      },
    },
  });
  response.code(200);
  return response;
};

const editAbookHandler = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);

      return response;
    }

    if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);

      return response;
    }

    const finished = (pageCount === readPage);

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);

  return response;
};

const deleteABookHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((note) => note.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);

  return response;
};

module.exports = {
  addABookHandler,
  getEntireBooksHandler,
  GetSpecificBook,
  editAbookHandler,
  deleteABookHandler,
};
