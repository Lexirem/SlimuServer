const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const animeSchema = new Schema({
    title: String,
    synopsis: String,
    episodes: String,
    category: String,

})
const Anime = mongoose.model('Anime', animeSchema);

module.exports = Anime;