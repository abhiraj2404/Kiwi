const API_URL = "http://localhost:8080/v1/events";

async function sendEvent() {
    const data = {
        user_id: "test-user-13",
        type: "usage_tick",
        seconds: 1,
        rate_per_second: 0.001,
        ts: Date.now()
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        console.log(`[${new Date().toISOString()}] ✅ Sent event1`);
    } catch (err) {
        console.error(`[${new Date().toISOString()}] ❌ Error:`, err.message);
    }
}
async function sendEvent2() {
    const data = {
        user_id: "test-user-143",
        type: "usage_tick",
        seconds: 1,
        rate_per_second: 0.002,
        ts: Date.now()
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        console.log(`[${new Date().toISOString()}] ✅ Sent event2`);
    } catch (err) {
        console.error(`[${new Date().toISOString()}] ❌ Error:`, err.message);
    }
}

// Send every 1 second
setInterval(sendEvent, 1000);
setInterval(sendEvent2, 1000);
