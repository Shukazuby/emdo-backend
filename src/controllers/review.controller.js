const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { reviewService } = require("../services");
const ApiError = require("../utils/ApiError");

const addReview = catchAsync(async (req, res) => {
    const { employeeId } = req.params;
  
    const review = await reviewService.addReview(req.user.id, employeeId, req.body);
  
    res.status(httpStatus.CREATED).send({ message: 'Review Added', review });
  });

const getReviewByEmployee = catchAsync(async (req, res) => {  
    const review = await reviewService.getReviewByEmployee(req.user.id);
    res.status(httpStatus.OK).send(review);
  });
const getReviews = catchAsync(async (req, res) => {  
    const review = await reviewService.getReviews(req.user.id, req.params.employeeId);
    if(!req.params.employeeId){
        throw new ApiError(httpStatus.NOT_FOUND, 'Employee does not exist')
      }

    res.status(httpStatus.OK).send(review);
  });

  const getAllReviewsByAdmin = catchAsync(async (req, res) => {
    const reviews = await reviewService.getAllReviewsByAdmin(req.user.id);
    res.status(httpStatus.OK).send(reviews);
  });
  


  const getEmployeeAllReviewsByAdmin = catchAsync(async (req, res) => {
    const reviews= await reviewService.getEmployeeAllReviewsByAdmin(req.user.id, req.params.employeeId);
    res.status(httpStatus.OK).send(reviews);
  });
  


module.exports = {
addReview,
getReviewByEmployee,
getReviews,
getAllReviewsByAdmin,
getEmployeeAllReviewsByAdmin,
}