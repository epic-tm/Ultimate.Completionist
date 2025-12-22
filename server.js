const express = require('express');
const app = express();
app.get('/', (_,res)=>res.send('Backend running'));
app.listen(3000,()=>console.log('Server on 3000'));
