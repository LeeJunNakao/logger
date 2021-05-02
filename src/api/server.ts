import 'module-alias/register';
import app from './app';
import { env } from '../config/env';

app.listen(env.PORT, () => console.log(`RUNING ON PORT ${env.PORT}`));
