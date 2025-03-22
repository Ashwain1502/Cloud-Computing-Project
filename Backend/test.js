/* eslint-disable no-unused-vars */
import axios from 'axios';

const API_URL = 'http://localhost:8080/execute';

let heavyCode = `function fibonacci(n) {
if (n <= 1) return n;
return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(30)); `
const requestData = { code: heavyCode };

const resp = {}
async function sendRequest() {
    try {
        const response = await axios.post(API_URL, requestData);
        if (resp[response.data.result.containerId]) {
            resp[response.data.result.containerId] += 1;
        } else {
            resp[response.data.result.containerId] = 1;
        }
    } catch (error) {
        console.error(error.response?.data || 'Error occurred');
    }
}

async function testConcurrentRequests() {
    const requests = Array.from({ length: 10 }, () => sendRequest());
    await Promise.all(requests);
    console.log('All requests completed');
    console.log(resp);
}

testConcurrentRequests();




// 30 fib , 100 requests