var mongoose = require('mongoose');

var CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true},
    seq: { type: Number, default: 0 }
});

mongoose.model('Counter', CounterSchema);
