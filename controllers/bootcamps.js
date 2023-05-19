const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	try {
		console.log("show all bootcamps");
		const bootcamps = await Bootcamp.find();
		res.status(200).json({
			success: true,
			count: bootcamps.length,
			data: bootcamps,
			msg: "Show all bootcamps",
		});
	} catch (error) {
		res.status(400).json({ success: false, msg: err.message });
	}
});

// @desc    Get a bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	try {
		console.log("show bootcamp");
		const bootcamp = await Bootcamp.findById(req.params.id);

		if (!bootcamp) {
			return next(
				new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
			);
		}

		res.status(200).json({
			success: true,
			data: bootcamp,
			msg: `Show bootcamp ${req.params.id}`,
		});
	} catch (error) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
});

// @desc    Create bootcamp
// @route   POST /api/v1/bootcamps
// @access  Public
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	try {
		console.log("create bootcamp");
		const bootcamp = await Bootcamp.create(req.body);
		res
			.status(201)
			.json({ success: true, data: bootcamp, msg: "Create new bootcamp" });
	} catch (err) {
		res.status(400).json({ success: false, msg: err.message });
	}
});

// @desc    Update new bootcamps
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	try {
		console.log("update bootcamp");
		const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!bootcamp) {
			return res.status(400).json({ success: false });
		}

		res.status(200).json({
			success: true,
			data: bootcamp,
			msg: `Update bootcamp ${req.params.id}`,
		});
	} catch (err) {
		res.status(400).json({ success: false, msg: err.message });
		next(err);
	}
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	try {
		console.log("delete bootcamp");
		const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

		if (!bootcamp) {
			return res.status(400).json({ success: false });
		}

		res.status(200).json({
			success: true,
			data: {},
			msg: `Delete bootcamp ${req.params.id}`,
		});
	} catch (err) {
		res.status(400).json({ success: false, msg: err.message });
	}
});
