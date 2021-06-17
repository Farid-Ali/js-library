let myLibrary = JSON.parse(localStorage.getItem("myLibrary")) || [];

function checkForStorageAvailablity(type) {
  let storage;
  try {
    storage = window[type];
    var x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function saveMyLibraryToLocalStorage() {
  if (checkForStorageAvailablity("localStorage")) {
    // Yippee! We can use localStorage awesomeness
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  } else {
    // Too bad, no localStorage for us
    console.log("No local storage for us");
  }
}

function Book(title, author, pages, isRead = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

Book.prototype.info = function () {
  let bookReadStatus = this.isRead ? "Read" : "not read yet";
  return `The ${this.title} by ${this.author}, ${this.pages} pages, ${bookReadStatus}`;
};

function addBookToLibrary(book) {
  myLibrary.push(book);
  saveMyLibraryToLocalStorage();
}

function showBookList() {
  const container = document.querySelector(".container");

  myLibrary.forEach((book) => {
    //Explanation: LINK https://stackoverflow.com/questions/59274053/preserve-instance-type-when-saving-to-localstorage#:~:text=addNewSkill(%22coding%22)%3B%20%2F%2F,to%20construct%20a%20new%20Employee.
    let retrieveBook = new Book(
      book.title,
      book.author,
      book.pages,
      book.isRead
    );
    const content = document.createElement("li");
    content.textContent = `${retrieveBook.title} => ${
      retrieveBook.author
    } => ${retrieveBook.info()}`;
    container.appendChild(content);
  });
}

function createNewBook() {
  const createNewBookBtn = document.querySelector("#createNewBook");
  createNewBookBtn.addEventListener("click", () => {
    const form = new FormData(document.querySelector("#form"));
    let bookTitle = form.get("title");
    let bookAuthor = form.get("author");
    let bookPages = form.get("pages");
    let createdBook = new Book(bookTitle, bookAuthor, bookPages);
    addBookToLibrary(createdBook);
  });
}
createNewBook();
showBookList();
