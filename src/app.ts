import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './routes';
import { notFoundHandler } from './middlewares/errorHandler';
import morgan from 'morgan';
const promBundle = require('express-prom-bundle');

dotenv.config();

const app: Application = express();

// Configuration des logs structurés (JSON) pour une ingestion facile par Filebeat/Logstash
app.use(morgan('{"remote_addr": ":remote-addr", "remote_user": ":remote-user", "date": ":date[clf]", "method": ":method", "url": ":url", "http_version": ":http-version", "status": ":status", "result_length": ":res[content-length]", "referrer": ":referrer", "user_agent": ":user-agent", "response_time": ":response-time"}'));

// Configuration des métriques Prometheus
const metricsMiddleware = promBundle({
  includeMethod: true, 
  includePath: true, 
  includeStatusCode: true, 
  includeUp: true,
  customLabels: { project_name: 'santeconnect' },
  promClient: {
    collectDefaultMetrics: {
    }
  }
});
app.use(metricsMiddleware);

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(notFoundHandler);

export default app;
