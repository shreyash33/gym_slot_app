let mongoose = require("mongoose");

var slotSchema = mongoose.Schema({
	name: {
		type: String,
        require: true
	},
	category: {
		type: String,
		required: true,
	},
	timeslot:{
        type: Date,
		require: true
    },
	timeslot_end:{
		type: Date,
		require: true
	}
});

var slot = (module.exports = mongoose.model("slot", slotSchema));

module.exports.get = function (callback, limit) {
	slot.find(callback).limit(limit);
};