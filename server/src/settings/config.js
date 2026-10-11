const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const authRouter = require("../auth/auth.router.js");
const usersRouter = require("../users/users.router.js");
const itemRouter = require("../items/items.router.js");
const adminRouter = require("../admin/admin.router.js");
const matchRouter = require("../matches/matches.router.js");
const claimRouter = require("../claims/claims.router.js");
const responseFormatter = require("../middleware/responseFormatter.middleware.js");
const { StatusCodes } = require("http-status-codes");
const expressWinstonLogger = require("../middleware/expressWinston.middleware.js");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger.config.js");

function configureApp(app) {

// Use CORS
// Enabled for all origins
//app.use(cors());
// Only requests from example.com
// app.use(cors(corsOptions));

// Using Morgan for logging
/**
 * File System Module (fs): Used to create a writable stream for the file where logs will be saved.
 * Path Module (path): Helps with handling file paths.
 * Create Write Stream: fs.createWriteStream() is used to create a stream that Morgan will write log data to. The 'a' flag ensures that logs are appended to the file (access.log) instead of overwriting it.
 */



const localOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];
const configuredOrigins = (process.env.CLIENT_ORIGINS || process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...localOrigins, ...configuredOrigins]);
const hostedDevelopmentOriginPatterns = [
  /^https?:\/\/[^/]+\.app\.github\.dev$/,
  /^https?:\/\/[^/]+\.devtunnels\.ms$/,
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.has(origin) ||
      hostedDevelopmentOriginPatterns.some((pattern) => pattern.test(origin));

    if (isAllowed) {
      callback(null, true);
    } else {
      const error = new Error(`CORS blocked: ${origin}`);
      error.status = 403;
      callback(error);
    }
  },
  credentials: true,
}));



var accessLogStream = fs.createWriteStream(
  //! The 'path.join' method joins all given path segments together using the platform-specific separator
  // '__dirname' is a Node.js variable that gives the directory name of the current module
  // '..' moves up one directory level from the current directory
  // 'access.log' is the file name we want to access or create in the parent directory
  // ! File is igniored in gitignore by default and need not be sent to git
  path.join(__dirname, "..", "access.log"),
  {
    flags: "a",
  }
);
app.use(morgan("combined", { stream: accessLogStream }));

// Format Response
app.use(responseFormatter);

//  Winston Express Logger Middleware
app.use(expressWinstonLogger);

//  Defining Routes
app.get("/health", (req, res) => res.status(StatusCodes.OK).json({ status: "ok" }));
app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/", itemRouter);
app.use("/", adminRouter);
app.use("/", matchRouter);
app.use("/", claimRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
console.log(swaggerSpecs);

app.use((error, req, res, next) => {
  console.error("Request failed:", error);
  const statusCode = error.status || error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    message: statusCode >= 500 ? "The request could not be completed." : error.message,
  });
});

// send back a 404 error for any unknown api request
// Sequence is important
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json(null);
});

}

module.exports = configureApp;