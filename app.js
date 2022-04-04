const express = require('express')
const app = express()
const fs = require('fs')
const PORT = 8080

let libraryDB = []

fs.readFile('./data/library.json', (err, data) => {
	if (!err) {
		libraryDB = JSON.parse(data)
	}
})

const parser = require('body-parser')
app.use(parser.urlencoded({extended: true}))

app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/donate', (req, res) => {
    res.render('donate', {show: req.query.success})
})

app.post('/donate', (req,res) => {
    const formData = req.body

    const book = {
        id: generateId(),
        title: formData.title,
        author: formData.author,
        genre: formData.genre,
        pageCount: formData.pageCount,
        cover: formData.cover,
        description: formData.description,
        rented: false
    }

    libraryDB.push(book)

    fs.writeFile('./data/library.json', JSON.stringify(libraryDB), (err) => {
        if (err) {
            res.redirect('/donate?success=0')
        } 
        else {
            res.redirect('/donate?success=1')
        }
    })
})

app.get('/books', (req, res) => {
	res.render('books', {books: libraryDB})
})

// app.get('/books/:id', (req, res) => {
// 	const id = parseInt(req.params.id)
// 	const book = libraryDB.find(book => book.id === id)

// 	res.render('book', {book: book})
// })

app.get('/books/:id/delete', (req, res) => {
	const id = parseInt(req.params.id)
	const index = libraryDB.findIndex(book => book.id === id)

	// Delete from libraryDB array
	libraryDB.splice(index, 1)

	// Update library.json file
	fs.writeFile('./data/library.json', JSON.stringify(libraryDB), (err) => {
		if (err) {
			res.redirect('/books?success=0')
		} else {
			res.redirect('/books?success=1')
		}
	})
})

// app.get('/books/:id/rent', (req, res) => {
// 	const id = parseInt(req.params.id)
// 	const index = libraryDB.findIndex(book => book.id === id)


// 	libraryDB[index].rented = true

// 	fs.writeFile('./data/library.json', JSON.stringify(libraryDB), (err) => {
// 		if (err) {
// 			res.redirect('/books/'+id+'?success=0')
// 		} else {
// 			res.redirect('/books/'+id+'?success=1')
// 		}
// 	})
// })

// app.get('/rented', (req, res) => {
// 	const books = libraryDB.filter(book => book.rented)

// 	res.render('rented', {books: book})
// })


app.listen(PORT, (err) => {
    if(err) throw err

    console.log(`Library is running on PORT ${PORT}`)
})

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9)
}