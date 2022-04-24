const express = require('express');

const app = express();
const port = 5000;

app.get('/api/todos', (req, res) => {
    return res.json({
        test_response: [
            {
                test_filed: 'test_0',
            },
            {
                test_filed_1: 'test_1',
            },
            {
                test_filed_3: 'test_3',
            },
        ],
    });
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
