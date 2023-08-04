const {
  addABookHandler,
  getEntireBooksHandler,
  GetSpecificBook,
  editAbookHandler,
  deleteABookHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addABookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getEntireBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: GetSpecificBook,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editAbookHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteABookHandler,
  },
];

module.exports = routes;
