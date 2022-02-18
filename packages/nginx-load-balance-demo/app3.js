const express = require('express');
const app = express();

// 定义要监听的端口号
const listenedPort = '8089';

app.get('/', (req, res) => res.send(`Hello World! I am port ${listenedPort}～`));

// 监听端口
app.listen(listenedPort, () => console.log(`success: ${listenedPort}`));
