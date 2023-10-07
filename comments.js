//Create web server
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const uuid = require('uuid');
const morgan = require('morgan');
const mongoose = require('mongoose');
const {Comments} = require('./models');
const {DATABASE_URL, PORT} = require('./config');

//Log HTTP layer
router.use(morgan('common'));

//Get all comments
router.get('/', (req, res) => {
  Comments
    .find()
    .then(comments => {
      res.json(comments.map(comment => comment.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

//Get comment by id
router.get('/:id', (req, res) => {
  Comments
    .findById(req.params.id)
    .then(comment => res.json(comment.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

//Post a new comment
router.post('/', (req, res) => {
  const requiredFields = ['author', 'content', 'rating', 'date'];
  for(let i=0; i<requiredFields.length; i++){
    const field = requiredFields[i];
    if(!(field in req.body)){
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
    Comments
      .create({
        id: uuid.v4(),