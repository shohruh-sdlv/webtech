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

app.listen(PORT, (err) => {
    if(err) throw err

    console.log(`Library is running on PORT ${PORT}`)
})

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9)
}