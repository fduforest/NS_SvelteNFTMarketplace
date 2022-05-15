var express = require("express")
var app = express()
const pinataApiKey = "639d0dfdc673f1247b61"
const pinataSecretApiKey =
  "565c297cacecab488ef40a210c2e2c17f1fc4f8279663b044358b0b15ff71c16"
const pinataSDK = require("@pinata/sdk")
const pinata = pinataSDK(pinataApiKey, pinataSecretApiKey)
const fs = require("fs")
const readableStreamForFile = null
const path = require("path")
const PORT = process.env.PORT || 3005
const formidable = require("formidable")
const ipfsGateway =
  "https://gateway.pinata.cloud/ipfs/" || "https://ipfs.io/ipfs/"

// middleware
app.use(express.json())

const cors = require("cors")
app.use(cors())

app.listen(3005, () => {
  console.log(`Server running on port ${PORT}`)
})

app.post("/upload", (req, res, next) => {
  const form = formidable({ multiples: true })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err)
      return
    }

    console.log(fields)
    let readableStreamForFile = fs.createReadStream(files.file.filepath)
    let auth
    let data = {}

    await pinata
      .testAuthentication()
      .then((result) => {
        auth = true
        //handle successful authentication here
      })
      .catch((err) => {
        //handle error here
        console.log(err)
        res.json(err)
      })

    if (auth) {
      let body = {}
      const options = {
        pinataMetadata: {
          name: fields.title,
        },
        pinataOptions: {
          cidVersion: 0,
        },
      }

      await pinata
        .pinFileToIPFS(readableStreamForFile, options)
        .then((result) => {
          body = {
            name: fields.title,
            description: fields.description,
            image: ipfsGateway + result.IpfsHash,
          }
          data.hash = result.IpfsHash
        })
        .catch((err) => {
          //handle error here
          console.log(err)
          res.json(err)
        })
      console.log(body)

      await pinata
        .pinJSONToIPFS(body, options)
        .then((result) => {
          //handle results here
          data.metadata = result.IpfsHash
          res.json(data)
        })
        .catch((err) => {
          //handle error here
          console.log(err)
          res.json(err)
        })
    }
  })
})
