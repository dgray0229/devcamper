const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");
// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    try {
        console.log("show all bootcamps");
        let query;
        // Copy req.query into a new object to manipulate
        const reqQuery = {...req.query};

        // Fields to exclude
        const removeFields = ["select", "sort", "page", "limit"];
        ;

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach((field) => delete reqQuery[field]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);
        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(
            /\b(gt|gte|lt|lte|in)\b/g,
            (match) => `$${match}`
        );
        // Finding resource
        query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(",").join(" ");
            query = query.select(fields);
        }
        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort;
            query = query.sort(sortBy);
        } else {
            query = query.sort({createdAt: -1});
        }
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Bootcamp.countDocuments();

        query = query.skip(startIndex).limit(limit);
        // Executing query
        const bootcamps = await query;
        // Pagination result
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }
        res.status(200).json({
            success: true,
            count: bootcamps.length,
            pagination,
            data: bootcamps,
            msg: "Show all bootcamps",
        });
    } catch (error) {
        res.status(400).json({success: false, msg: error.message});
    }
});

// @desc    Get a bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
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
            .json({success: true, data: bootcamp, msg: "Create new bootcamp"});
    } catch (error) {
        res.status(400).json({success: false, msg: error.message});
    }
});

// @desc    Update new bootcamps
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    console.log("update bootcamp");
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: bootcamp,
        msg: `Update bootcamp ${req.params.id}`,
    });
});

// @desc	Get bootcamps within a radius
// @route	GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access	Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const {zipcode, distance} = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth (3,963 mi / 6,378 km)
    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {$centerSphere: [[lng, lat], radius]},
        },
    });
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
        msg: `Show bootcamps within ${distance} miles of ${zipcode}`,
    });
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    console.log("delete bootcamp");
    const bootcamp = await Bootcamp.findOneAndRemove(req.params.id);

    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: {},
        msg: `Delete bootcamp ${req.params.id}`,
    });
});
