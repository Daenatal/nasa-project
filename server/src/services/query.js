//give us a reusable of making any endpoint paginated
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

function getPagination(query) {
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT; //this math function returns the absolute value of a number if you pass it a string it converts it to a number
    const skip = (page - 1) * limit;

    return {
        skip,
        limit,
    }
}

module.exports = {
    getPagination,
}