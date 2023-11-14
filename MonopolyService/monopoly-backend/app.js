const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Define routes here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});