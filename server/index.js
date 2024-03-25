const config = require('config')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = config.get("serverPort.port")
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use('/api/enthusiasm', require('./routes/Enthusiasm/routes'))


const start = async () => {
  try {
    await mongoose.connect(config.get("database.Enthusiasm"))
    console.log('DB connected')
    
    app.listen(PORT, () => { console.log('Server running on port: ', PORT); })
  } catch (error) {
    console.error('DB Connection Error', error)
  }
}

start()
