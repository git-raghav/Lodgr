// Wraps an async function to handle async errors like database operations
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
