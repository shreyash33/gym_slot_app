const slot = require("./model");
const fs = require("fs");

exports.index = function (req, res) {
	slot.get((err, slots) => {
		if (err) {
			res.json({
				status: "Error",
				message: err,
			});
		} else {
			res.json({
				status: "Success",
				message: "All Booked time slots",
				data: slots,
			});
		}
	});
};

exports.new = function (req, res) {
	var sl = new slot();
	sl.name = req.body.name;
	sl.category = req.body.category;
	var d = new Date();
	var d1 = new Date();
	var month = String(parseInt(req.body.month) - 1);
	d.setUTCFullYear(req.body.year, month, req.body.day);
	d.setUTCHours(req.body.hour, req.body.minutes, 0, 0);
	sl.timeslot = d;
	var month_end = String(parseInt(req.body.month_end) - 1);
	d1.setUTCFullYear(req.body.year_end, month_end, req.body.day_end);
	d1.setUTCHours(req.body.hour_end, req.body.minutes_end, 0, 0);
	sl.timeslot_end = d1;
	slot.findOne(
		{
			$and: [
				{ category: req.body.category },
				{ $nd: [{ timeslot: { $lt: d1 } }, { timeslot_end: { $gt: d } }] },
			],
		},
		(err, sl1) => {
			if (!sl1) {
				sl.save((err) => {
					if (err) {
						res.json({
							status: "Error",
							message: err,
						});
					} else {
						res.json({
							status: "Success",
							message: sl,
						});
					}
				});
			} else {
				res.send("Time slot exist for given category and time slot" + sl1);
			}
		}
	);
};

exports.view = function (req, res) {
	slot.find({ category: req.body.category }, (err, sl) => {
		if (err) {
			res.json({
				status: "Error",
				message: err,
			});
		} else {
			res.json({
				status: "Success",
				message: sl,
			});
		}
	});
};

exports.update = function (req, res) {
	var output = {};
	if (req.body.name) {
		output.name = req.body.name;
	}

	if (req.body.category) {
		output.category = req.body.category;
	}

	if (req.body.hour) {
		var d = new Date();
		var d1 = new Date();
		month = String(parseInt(req.body.month) - 1);
		d.setUTCFullYear(req.body.year, month, req.body.day);
		d.setUTCHours(req.body.hour, req.body.minutes, 0, 0);
		output.timeslot = d;
		var month_end = String(parseInt(req.body.month_end) - 1);
		d1.setUTCFullYear(req.body.year_end, month_end, req.body.day_end);
		d1.setUTCHours(req.body.hour_end, req.body.minutes_end, 0, 0);
		output.timeslot_end = d1;
		//console.log(output)
	}

	slot.findById(req.body.id, (err, sl1) => {
		if (err) {
			res.send("Error in id");
		} else {
			slot.findOne(
				{
					$and: [
						{
							$and: [
								{
									timeslot: {
										$lt: output.timeslot_end ? output.timeslot_end : sl1.timeslot_end,
									},
								},
								{
									timeslot_end: {
										$gt: output.timeslot ? output.timeslot : sl1.timeslot,
									},
								},
							],
						},
						{ category: output.category ? output.category : sl1.category },
					],
				},
				(err, sl2) => {
					if (!sl2) {
						slot.updateOne(
							{ _id: req.body.id },
							{ $set: output },
							{ upsert: true },
							(err, sl) => {
								if (err) {
									res.json({
										status: "Error",
										message: err,
									});
								} else {
									res.json({
										status: "Success",
										message: sl,
									});
								}
							}
						);
					} else {
						res.send("The new Time slot and category exist" + sl2);
					}
				}
			);
		}
	});
};

exports.delete = function (req, res) {
	slot.deleteOne({ _id: req.body.id }, (err, sl) => {
		if (err) {
			res.json({
				status: "Error",
				message: err,
			});
		} else {
			res.json({
				status: "Success",
				message: sl,
			});
		}
	});
};

setInterval(() => {
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth();
	var day = d.getDate();
	var hour = d.getHours();
	var minutes = d.getMinutes();
	var d1 = new Date();
	d1.setUTCFullYear(year, month, day);
	d1.setUTCHours(hour, minutes, 0, 0);
	console.log(d1)
	slot.find({ timeslot_end: { $lt: d1 } }, (err, sl) => {
		if (err) {
			fs.appendFile("log.txt", err + "\n", (err) => {
				if (err) {
					console.log("Error in appending file");
				}
			});
		} else if (sl[0] != undefined) {
			console.log(sl)
			console.log(d1);
			fs.appendFile("log.txt", String(sl[0]) + "\n", (err) => {
				if (err) {
					console.log("Error in appending file");
				} else {
					slot.deleteOne({ _id: sl[0].id }, (err, out) => {
						if (err) {
							console.log("Error in deleting record");
						} else {
							console.log("Record deleted");
						}
					});
				}
			});
		} else {
			//console.log(d1)
		}
	});
}, 30000);
