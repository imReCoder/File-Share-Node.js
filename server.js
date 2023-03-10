const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

const PORT = process.env.PORT || 3000
const connectDB = require('./config/db')
connectDB()

const corsOptions = {
  origin: '*'
}
app.use(cors(corsOptions));
//request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
})
app.use(express.json())
app.use(express.static('public'))
app.set('views', path.join(__dirname, '/public/views'))
app.set('view engine', 'ejs')

app.use('/', require('./routes/home'))
app.use('/api/files', require('./routes/files'))
app.use('/files', require('./routes/filePreview'))
app.use('/files/download', require('./routes/download'))

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`)
});