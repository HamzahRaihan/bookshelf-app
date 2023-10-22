window.addEventListener('DOMContentLoaded', () => {
  const inCompleteBook = document.getElementById('incompleteBookshelfList');
  const completeBook = document.getElementById('completeBookshelfList');

  // const searchedBooks = document.getElementById('searchedBooks');

  const inputBookTitle = document.getElementById('inputBookTitle');
  const inputBookAuthor = document.getElementById('inputBookAuthor');
  const inputBookYear = document.getElementById('inputBookYear');
  const inputBookIsComplete = document.getElementById('inputBookIsComplete');
  const formInputBook = document.getElementById('inputBook');

  const BOOK_KEY = 'bookData';

  const completed = (book) => {
    console.log('🚀 ~ file: main.js:14 ~ completed ~ book:', book);
    const bookCard = card(book);
    completeBook.innerHTML += bookCard;
  };

  const inComplete = (book) => {
    const bookCard = card(book);
    inCompleteBook.innerHTML += bookCard;
  };

  // render book list
  const displayBooks = (searchs) => {
    console.log('🚀 ~ file: main.js:25 ~ displayBooks ~ search:', searchs);
    // reset semua konten
    inCompleteBook.innerHTML = '';
    completeBook.innerHTML = '';

    // dan tampilkan konten terbaru
    const bookData = JSON.parse(localStorage.getItem(BOOK_KEY)) || [];
    console.log('🚀 ~ file: main.js:53 ~ formInputBook.addEventListener ~ bookData:', bookData);
    if (searchs) {
      searchs?.forEach((search) => {
        console.log('🚀 ~ file: main.js:41 ~ searchs.forEach ~ search:', search);
        if (search.isComplete) {
          completed(search);
        } else {
          inComplete(search);
        }
      });
    } else {
      bookData?.forEach((book) => {
        if (book.isComplete) {
          completed(book);
        } else {
          inComplete(book);
        }
      });
    }

    updateData();
  };

  displayBooks();

  formInputBook.addEventListener('submit', (e) => {
    e.preventDefault();
    const books = {
      id: +new Date(),
      title: inputBookTitle.value,
      author: inputBookAuthor.value,
      year: parseInt(inputBookYear.value),
      isComplete: inputBookIsComplete.checked,
    };
    const bookData = JSON.parse(localStorage.getItem(BOOK_KEY)) || [];
    bookData.push(books);
    localStorage.setItem(BOOK_KEY, JSON.stringify(bookData));

    displayBooks();
  });

  // update data function
  function updateData() {
    const buttonRead = document.querySelectorAll('.read');
    const buttonUnread = document.querySelectorAll('.unread');
    const deleteButtons = document.querySelectorAll('.red');

    buttonRead.forEach((read) => {
      read.addEventListener('click', (e) => {
        e.preventDefault();
        addToCompletedBooks(read.id);
      });
    });

    buttonUnread.forEach((unread) => {
      unread.addEventListener('click', (e) => {
        e.preventDefault();
        addToIncompletedBooks(unread.id);
      });
    });

    deleteButtons.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        deleteBooks(item.id);
      });
    });
  }

  function addToCompletedBooks(id) {
    const bookData = JSON.parse(localStorage.getItem(BOOK_KEY)) || [];

    // system should find id before add to complete so system can add to complete  a specific data
    const findId = bookData.find((c) => c.id == id);
    if (findId) {
      // return isComplete boolean true
      findId.isComplete = true;
      localStorage.setItem(BOOK_KEY, JSON.stringify(bookData));
      displayBooks();
    } else {
      console.log(`book with id ${id} not found`);
    }
  }

  function addToIncompletedBooks(id) {
    const bookData = JSON.parse(localStorage.getItem(BOOK_KEY)) || [];

    // system should find id before undo so system can undo a specific data
    const undoById = bookData.find((i) => i.id == id);
    console.log('🚀 ~ file: main.js:68 ~ addToCompletedBooks ~ findId:', undoById);
    if (undoById) {
      undoById.isComplete = false;
      localStorage.setItem(BOOK_KEY, JSON.stringify(bookData));
      displayBooks();
    } else {
      console.log(`book with id ${id} not found`);
    }
  }

  // delete books function
  function deleteBooks(id) {
    const bookData = JSON.parse(localStorage.getItem(BOOK_KEY)) || [];
    // system should find id before delete so system can delete a specific data
    const findId = bookData.findIndex((item) => item.id == id);
    if (findId !== -1) {
      bookData.splice(findId, 1);
      localStorage.setItem(BOOK_KEY, JSON.stringify(bookData));
      displayBooks();
    } else {
      console.log(`book with id ${id} not found`);
    }
  }

  const searchBookInput = document.getElementById('searchBook');
  const searchBookTitle = document.getElementById('searchBookTitle');
  // const results = document.getElementById('results');

  // submit search input so user can search book they want
  searchBookInput.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchInput = searchBookTitle.value;
    console.log('🚀 ~ file: main.js:129 ~ searchBook.addEventListener ~ searchInput:', searchInput);
    const bookData = JSON.parse(localStorage.getItem(BOOK_KEY)) || [];

    // if search input has no input give user all books, if user has input give a specific book user's input
    if (searchInput == '') {
      const searchResults = JSON.parse(localStorage.getItem(BOOK_KEY)) || [];
      displayBooks(searchResults);
    } else {
      const searchResults = bookData.filter((item) => item.title == searchInput);
      displayBooks(searchResults);
    }
  });

  // function displaySearched(results) {
  //   const renderResults = results.map((item) => card(item)).join('');
  //   searchedBooks.innerHTML = renderResults;
  // }
});
const card = (b) => {
  return `
  <article class="book_item">
    <h3>${b.title}</h3>
    <p>Penulis: ${b.author}</p>
    <p>Tahun: ${b.year}</p>

    <div class="action">
    ${!b.isComplete ? `<button class="green read" id=${b.id} >Selesai dibaca</button>` : `<button class="green unread" id=${b.id}>Belum selesai dibaca</button>`}
      <button class="red" id=${b.id}>Hapus buku</button>
    </div>
  </article>`;
};
