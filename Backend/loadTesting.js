import autocannon from 'autocannon';


let heavyCode = `function fibonacci(n) {
if (n <= 1) return n;
return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(32)); `

async function runTest() {
    const result = await autocannon({
        url: 'http://localhost:8080/execute',
        connections: 10,
        duration: 30,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "code": heavyCode
        }),
    });

    console.log(result);
}

runTest();