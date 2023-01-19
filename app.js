import express from 'express';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';

const swaggerDocument = YAML.load('./swagger.yaml');

// requiring routes
import errorHandlerMiddleware from './middlewares/errorHandler.js';
import NotFoundError from './errors/notFound.js';
import authRoute from './routes/auth.js';
import userRoute from './routes/users.js';
import productRoute from './routes/products.js';
import cartRoute from './routes/carts.js';
import orderRoute from './routes/order.js';
import stripeRoute from './routes/stripe.js';

dotenv.config({ path: './config.env' });

const app = express();
console.log(app.get('env'));
/*
"jest": "^26.5.3",
"supertest": "^5.0.0"
*/

// global middleware
// implement CORS
app.use(cors());
// Access-Control-Allow-Origin
app.options('*', cors());

// set security HTTP headers
app.use(helmet());

// development logging
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

// limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!',
});

app.use('/api', limiter);

// body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// cookie parser middleware
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(hpp());

// compression
app.use(compression());

// test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //   console.log(req.headers);
  next();
});

// swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/', (req, res) => {
  res
    .status(StatusCodes.OK)
    .send(`<h1>eCommerce API</h1><a href="/api-docs">Documentation</a>`);
});

// api routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/carts', cartRoute);
app.use('/api/v1/orders', orderRoute);
app.use('/api/v1/checkout', stripeRoute);

app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server`));
});

app.use(errorHandlerMiddleware);

export default app;
