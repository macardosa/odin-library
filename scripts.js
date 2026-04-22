const myLibrary = [];

function Book(title, author, pages, read = false) {
    if (!new.target) {
        throw Error("This function must be called with the new operator");
    }
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(title, author, pages, isRead) {
    myLibrary.push(new Book(title, author, pages, isRead));
}

// add some books
addBookToLibrary("1984", "George Orwell", 328);
addBookToLibrary("Brave New World", "Aldous Huxley", 288);
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 310);

//DOM elements
const pageWrapper = document.querySelector(".page-wrapper");
const form = document.querySelector(".data-entry");
const booksList = document.querySelector(".books-list");

function displayBookEntry(book, index) {
    const hasBeenRead = (book.read) ? "Yes" : "No";
    const fields = [
        book.title,
        book.author,
        book.pages,
        hasBeenRead
    ]

    fields.forEach(value => {
        const div = document.createElement("div");
        div.classList.add(`book-item-${index}`);
        div.textContent = value;
        booksList.appendChild(div);
    });

    const img = document.createElement("img");
    img.src = "./assets/trash-bin.svg";
    img.alt = "";
    img.ariaHidden = "true";
    img.dataset.id = book.id;
    img.classList.add("trash-icon");
    img.classList.add(`book-item-${index}`);
    booksList.appendChild(img);
}

function displayBooksInLibrary() {
    myLibrary.forEach((book, index) => {
        displayBookEntry(book, index);
    });
}

displayBooksInLibrary();

// Button to add new books
document.querySelector('.new-book-btn').addEventListener("click", (e) => {
    form.style.display = "flex";
    pageWrapper.style.gridTemplateColumns = "1fr 1fr";
});

// get data from books
form.addEventListener("submit", (e) => {
    if (!form.checkValidity()) {
        return;
    }

    // get user data
    e.preventDefault(); // prevent submission of the form
    const title = form.querySelector("#title").value;
    const author = form.querySelector("#author").value;
    const pages = form.querySelector("#pages").value;
    const isRead = form.querySelector("#isRead").checked;

    // add book to library
    addBookToLibrary(title, author, pages, isRead);

    // hide and clear form
    form.reset();
    form.style.display = "none";

    pageWrapper.style.gridTemplateColumns = "1fr";

    // add book to list on page
    const index = myLibrary.length - 1;
    const book = myLibrary[index];
    displayBookEntry(book, index);
});

// cancel data input
document.querySelector('.cancel-btn').addEventListener("click", (e) => {
    form.style.display = "none";
    pageWrapper.style.gridTemplateColumns = "1fr";
});

// functionality to delete books from library
const trashIcons = Array.from(document.querySelectorAll(".trash-icon"));
trashIcons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        if (!confirm("Are you sure you want you delete this book?")) {
            return;
        }

        // get id of the book to delete
        const bookId = btn.dataset.id;

        // find book in library and delete it
        const index = myLibrary.findIndex(book => book.id === bookId);
        myLibrary.splice(index, 1);

        // delete entry from table
        const items = Array.from(document.querySelectorAll(`.book-item-${index}`));
        items.forEach(item => {
            item.remove();
        });
    });
});

