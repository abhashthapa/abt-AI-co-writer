import React, { useState, useEffect } from 'react';

function Dashboard({ onCreateBook, onSelectBook, onToggleSettings }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const savedBooks = Object.keys(localStorage)
      .filter(key => key.startsWith('book-'))
      .map(key => JSON.parse(localStorage.getItem(key)));
    setBooks(savedBooks);
  }, []);

  const handleCreateBook = () => {
    setIsPopupOpen(true);
  };

  const handleSaveBook = () => {
    if (bookTitle.trim()) {
      onCreateBook(bookTitle);
      setBookTitle('');
      setIsPopupOpen(false);
    } else {
      alert('Please enter a book title.');
    }
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h2>Dashboard</h2>
        <button className="icon-button" onClick={onToggleSettings}>
          <span className="material-icons-outlined">settings</span>
        </button>
      </div>
      <div className="grid-container">
        <button className="grid-item icon-button create-book" onClick={handleCreateBook}>
          <span className="material-icons-outlined">add</span>
          Create New Book
        </button>
        {books.map((book, index) => (
          <div key={index} className="grid-item" onClick={() => onSelectBook(book.title)}>
            <span>{book.title}</span>
          </div>
        ))}
      </div>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h3>Enter Book Title</h3>
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              placeholder="Book Title"
            />
            <button onClick={handleSaveBook}>Save</button>
            <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
