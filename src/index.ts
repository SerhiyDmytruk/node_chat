'use strict';

import 'dotenv/config';
import app from './app';

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, () => {
  process.stdout.write(`Server listening on http://localhost:${PORT}\n`);
});
