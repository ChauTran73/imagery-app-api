module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL ||
    "http://localhost:8000/api",
    DB_URL: process.env.DB_URL || 'postgresql://dunder-mifflin:dunder@localhost/imagery-api',
  }