const express = require('express')
const app = express()

const fs = require('fs')
const PORT = 3000

app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    fs.readFile('./data/library.json', (err, data) => {
        if (err) throw err

        const libraryFile = JSON.parse(data)

        res.render('home', {bookShelf: libraryFile})

    })

    res.render('home')
})

app.post('/add', (req,res) => {
    const formData = req.body

    if (formData.name.trim() == '')
    {
        res.render('home', { error: true })
    }
    else {
        fs.readFile('./data/library.json', (err, data) => {
            if (err) throw err

            const libraryFile = JSON.parse(data)

            const library = {
                id: id(),
                name: formData.name,
                done: false
            }

            library.push(library)

            fs.writeFile('./data/library.json', JSON.stringify(libraryFile), (err) => {
                if (err) throw err

                fs.readFile('./data/library.json', (err,data) => {
                    if (err) throw err

                    const libraryFile = JSON.parse(data)
                    res.render('home', {success: true, bookShelf: libraryFile})
                })
            })

        })
    }
})

app.listen(PORT, (err) => {
    if(err) throw err

    console.log(`goof ${PORT}`)
})

function id() {
    return '_' + Math.random().toString(36).substr(2, 9)
}