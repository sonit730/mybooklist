//Book Class: Represents a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class: Handle UI Tasks
class UI {
    static displayBooks () {

        const books = Store.getBooks();

        books.forEach((book) => UI.addBooksToList(book))
    }

    static addBooksToList (book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr')

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete" data-isbn="${book.isbn}">X</a></td>
        `

        list.appendChild(row)
    }

    static showAlert (message, className) {
        const divMessage = document.querySelector('.alert')
        if (className === 'success') {
            divMessage.classList.remove(`alert-danger`)
            divMessage.classList.add(`alert-${className}`)
        } else if (className === 'danger') {
            divMessage.classList.remove(`alert-success`)
            divMessage.classList.add(`alert-${className}`)
        }
        divMessage.innerText = message
    }

    static deleteBook (element) {
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.remove()
        }
    }

    static clearFields () {
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#isbn').value = ''
    }
}


//Store Class: Handless Store
class Store {
    static getBooks () {
        let books;
        if (localStorage.getItem('books') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books
    }

    static addBook (book) {
        const books = Store.getBooks()
        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook (isbn) {
        const books = Store.getBooks()

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1)
            }
        })

        localStorage.setItem('books', JSON.stringify(books))
    }
}


//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

//Event: Add a Book
let formEl = document.getElementById("book-form")
formEl.addEventListener('submit', (event) => {
    //Prevent actual submit
    event.preventDefault();

    //Get form values
    const formData = new FormData(formEl)
    const formDataObj = Object.fromEntries(formData);
    const { title, author, isbn } = formDataObj

    //Validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger')
    } else {
        //Instatiate book
        const book = new Book(title, author, isbn)

        //Add Book to UI
        UI.addBooksToList(book)

        //Add to book to Store
        Store.addBook(book)

        UI.showAlert('Add book success', 'success')


        //Clear fields
        UI.clearFields()
    }


})

//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', function (event) {

    //Remove book from UI
    UI.deleteBook(event.target)

    //Remove book from store
    Store.removeBook(event.target.parentElement.previousElementSibling.textContent)

    //Show message
    UI.showAlert('Book remove success', 'success')

})
