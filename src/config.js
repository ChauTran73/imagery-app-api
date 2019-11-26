
module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL ||
    "http://localhost:8000/api",
    JWT_SECRET: "my_secret_shhh",
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder-mifflin:dunder@localhost/imagery-api',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://dunder-mifflin:dunder@localhost/imagery-api-test'
  }