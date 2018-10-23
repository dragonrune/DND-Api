const express = require('express')
const bodyParser = require('body-parser')
const monk = require('monk')
const db = monk('mongodb://admin:password1@ds133113.mlab.com:33113/dnd-char')
const DNDCharCollection = db.get('dnd-char')
const Joi = require('joi')
const app = express()
const port = 3030

app.use(bodyParser.json())

const schema = Joi.object().keys({
    id: Joi.string(),
    name: Joi.string().regex(/^[a-zA-Z ]{3,30}$/).required(),
    str: Joi.number().integer().min(1).max(20).required(),
    dex: Joi.number().integer().min(1).max(20).required(),
    con: Joi.number().integer().min(1).max(20).required(),
    int: Joi.number().integer().min(1).max(20).required(),
    wis: Joi.number().integer().min(1).max(20).required(),
    cha: Joi.number().integer().min(1).max(20).required()
})

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    next()
})

app.get('/', async (req, res) => {
    try {
        const CharacterArr = await DNDCharCollection.find({})
        res.send(CharacterArr)
    } catch (error) {
        res.send(error)
    }
})

app.post('/', async (req, res) => {
    // Validate data
    const result = Joi.validate(req.body, schema)
    if (result.error)
        res.send(result.error)
    else {
        try {
            await DNDCharCollection.insert(req.body)
            const CharacterArr = await DNDCharCollection.find({})
            res.send(CharacterArr)
        } catch (error) {
            res.send(error)
        }
    }
})

app.put('/', async (req, res) => {
    // Validate data
    const result = Joi.validate(req.body, schema)
    if (result.error)
        res.send(result.error)
    else {
        try {
            await DNDCharCollection.update(
                { _id: req.body.id },
                { $set: req.body })
            const CharacterArr = await DNDCharCollection.find()
            res.send(CharacterArr)
        } catch (error) {
            res.send(error)
        }
    }
})

app.delete('/', async (req, res) => {
    try {
        await DNDCharCollection.remove(
            { _id: req.body.id },
            { $set: req.body })
        const CharacterArr = await DNDCharCollection.find()
        res.send(CharacterArr)
    } catch (error) {
        res.send(error)
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
