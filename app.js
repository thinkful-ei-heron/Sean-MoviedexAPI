'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIELIST = require('./movies-data-small.json');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res
                .status(401).json({error:'Unauthorized Request'});
    }

    next();

});

app.get('/movie', (req, res) => {
  let genreUncased = req.query.genre;
  let countryUncased = req.query.country;
  let avg_voteUncased = req.query.avg_vote;
  let genre = '';
  let country = '';
  let avg_vote = '';
  let fixedCountryName = '';
  let fullList = MOVIELIST.MOVIES;


  if (genreUncased) {
    let genre1 = genreUncased.toLowerCase();
    genre =  genre1.charAt(0).toUpperCase() + genre1.slice(1);
  }

  if (countryUncased) {
    let country1 = countryUncased.toLowerCase();
    let newArray = country1.split(' ');
    for (let i=0; i < newArray.length; i++){
      let temp = newArray[i].split('');
      let fix = temp.join('');
      let fix1 = fix.charAt(0).toUpperCase() + fix.slice(1);
      fixedCountryName = fixedCountryName + ' ' + fix1;
    }
    country = fixedCountryName.trim();
  }

  if (avg_voteUncased) {
    avg_vote = avg_voteUncased;
  }

  const filterGenre = a => a.genre === genre;
  const filterCountry = b => b.country.includes(country);
  const filterVote = c => c.avg_vote > avg_vote;

  if (((genre !== '') && (country !=='' )) && (avg_vote !=='' )) {
    const activeFilters = [filterGenre, filterCountry, filterVote];
    let filteredList = fullList;
    for (let filterIndex in activeFilters){
      filteredList = filteredList.filter(activeFilters[filterIndex]);
    }
    return res
      .status(201)
      .send(filteredList)
      .end();
  }

  else if (genre && country && (avg_vote ==='')){
    const activeFilters = [filterGenre, filterCountry];
    let filteredList = fullList;
    for (let filterIndex in activeFilters){
      filteredList = filteredList.filter(activeFilters[filterIndex]);
    }
    return res
      .status(201)
      .send(filteredList)
      .end();
  }

  else if (genre && avg_vote & (country ==='' )){
    const activeFilters = [filterGenre, filterVote];
    let filteredList = fullList;
    for (let filterIndex in activeFilters){
      filteredList = filteredList.filter(activeFilters[filterIndex]);
    }
    return res
      .status(201)
      .send(filteredList)
      .end();
  }

  else if ((genre === '') && (country) && (avg_vote)){
    const activeFilters = [filterCountry, filterVote];
    let filteredList = fullList;
    for (let filterIndex in activeFilters){
      filteredList = filteredList.filter(activeFilters[filterIndex]);
    }
    return res
      .status(201)
      .send(filteredList)
      .end();
  }
  
  else if (country && genre === '' && avg_vote==='') {
    const activeFilters = [filterCountry];
    let filteredList = fullList;
    for (let filterIndex in activeFilters){
      filteredList = filteredList.filter(activeFilters[filterIndex]);
    }
    return res
      .status(201)
      .send(filteredList)
      .end();
  }

  else if (genre && country ==='' && avg_vote === '') {
    const activeFilters = [filterGenre];
    let filteredList = fullList;
    for (let filterIndex in activeFilters){
      filteredList = filteredList.filter(activeFilters[filterIndex]);
    }
    return res
      .status(201)
      .send(filteredList)
      .end();
  } 

  else if (genre==='' && country==='' && avg_vote) {
    const activeFilters = [filterVote];
    let filteredList = fullList;
    for (let filterIndex in activeFilters){
      filteredList = filteredList.filter(activeFilters[filterIndex]);
    }
    return res
      .status(201)
      .send(filteredList)
      .end();
  }
  return res
    .status(500)
    .send("There has been a server error..")
    .end();
});


app.listen(49443, () => console.log('Server on 49443'));