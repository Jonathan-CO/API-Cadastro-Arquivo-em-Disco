import dotenv from 'dotenv';
import express from 'express';
import routes from './routes';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (_, res) =>
  res.json({
    message: 'API rest para cadastro e geração de arquivos de usuários.',
  }),
);

app.use(routes);

app.listen(process.env.PORT, () => {
  console.log('Server is running!'); // eslint-disable-line no-console
});
