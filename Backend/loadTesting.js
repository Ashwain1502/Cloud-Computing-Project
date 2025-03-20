import autocannon from 'autocannon';


async function runTest() {
    const result = await autocannon({
        url: 'http://localhost:3001/execute',
        connections: 100,
        duration: 30,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "code": "console.log(123)"
        }),
    });

    console.log(result);
}

runTest();