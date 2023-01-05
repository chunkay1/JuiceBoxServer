const express = require('express')
const app = express();

const port = 1337
const animals = require('./snippet2')

app.get('/', (req, res) => {
    res.send(animals)
})

app.get('/kittens', (req, res) => {
    res.send(`
    <html>
        <main>
            <body>
                <h1>Kittens!</h1>
            </body>
        </main>
    </html>
    `)
})

app.get('/puppies', (req, res) => {
    res.send(`
    <html>
        <main>
            <body>
                <h1>puppies</h1>
            </body>
        </main>
    </html>
    `)
})

app.listen(`${port}`);