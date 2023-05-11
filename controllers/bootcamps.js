// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) => {
	console.log("show all bootcamps");
	res.status(200).json({ success: true, msg: "Show all bootcamps" });
};

// @desc    Get a bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = (req, res, next) => {
	console.log("show bootcamp");
	res
		.status(200)
		.json({ success: true, msg: `Show bootcamp ${req.params.id}` });
};

// @desc    Create bootcamp
// @route   POST /api/v1/bootcamps
// @access  Public
exports.createBootcamp = (req, res, next) => {
	console.log("create bootcamp");
	res.status(200).json({ success: true, msg: "Create new bootcamp" });
};

// @desc    Update new bootcamps
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
	console.log("update bootcamp");
	res
		.status(200)
		.json({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
	console.log("delete bootcamp");
	res
		.status(200)
		.json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
