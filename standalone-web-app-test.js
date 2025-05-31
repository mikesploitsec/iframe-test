// 🧪 Mikesploit Web App Security Test Suite (v2.1)
// Paste into any browser console to test basic web app security properties.

(() => {
    console.log("🧪 Mikesploit Web App Security Test Suite: Starting...");

    const targetOrigin = window.location.origin;
    let apiBase = null;

    const commonApiEndpoints = [
        "/api", "/api/v1", "/api/v2", "/v1", "/v2", "/rest", "/graphql",
        "/openai", "/chatbot", "/data", "/backend", "/auth", "/config",
        "/status", "/health", "/docs"
    ];

    function log(msg) {
        console.log(`[TestLog] ${msg}`);
    }

    async function discoverApiBase() {
        log("🔎 Discovering API base...");
        for (let path of commonApiEndpoints) {
            const url = targetOrigin + path;
            try {
                const res = await fetch(url, { method: 'GET', mode: 'cors' });
                if (res.ok) {
                    apiBase = url;
                    log(`✅ API base found: ${apiBase} (Status: ${res.status})`);
                    return;
                } else {
                    log(`🟡 Probe failed for ${url} (Status: ${res.status})`);
                }
            } catch (e) {
                log(`❌ Probe error for ${url}: ${e}`);
            }
        }
        log("❌ No API base found; tests will proceed without dynamic endpoint.");
    }

    function sendPostMessage() {
        parent.postMessage('Test message from Console Test Suite', '*');
        log('Sent postMessage to parent.');
    }

    function attemptCORSFetch() {
        if (!apiBase) return log("⚠️ Skipping CORS fetch: no API base found.");
        fetch(apiBase + '/health', { mode: 'cors' })
            .then(response => response.text())
            .then(data => log('CORS Fetch Success: ' + data))
            .catch(err => log('CORS Fetch Error: ' + err));
    }

    function attemptCookieAccess() {
        try { log('Document cookies: ' + document.cookie); }
        catch (err) { log('Cookie access error: ' + err); }
    }

    function testWindowTop() {
        try { log('window.top.location: ' + window.top.location.href); }
        catch (err) { log('window.top access error: ' + err); }
    }

    function testWindowOpener() {
        try { log(window.opener ? 'window.opener is accessible' : 'window.opener is null'); }
        catch (err) { log('window.opener access error: ' + err); }
    }

    function attemptCookieWrite() {
        try { document.cookie = "testcookie=1; SameSite=None; Secure"; log('Cookie write attempt made.'); }
        catch (err) { log('Cookie write error: ' + err); }
    }

    function testLocalStorage() {
        try {
            localStorage.setItem("testKey", "testValue");
            log("localStorage test: " + localStorage.getItem("testKey"));
        } catch (err) {
            log("localStorage access error: " + err);
        }
    }

    function testSessionStorage() {
        try {
            sessionStorage.setItem("testKey", "testValue");
            log("sessionStorage test: " + sessionStorage.getItem("testKey"));
        } catch (err) {
            log("sessionStorage access error: " + err);
        }
    }

    function testReferrer() {
        log("document.referrer: " + document.referrer);
    }

    function testFormSubmission() {
        if (!apiBase) return log("⚠️ Skipping form test: no API base found.");
        const form = document.createElement("form");
        form.action = apiBase + "/test-form";
        form.method = "POST";
        const input = document.createElement("input");
        input.name = "testField";
        input.value = "testValue";
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        log("Form submitted to: " + form.action);
    }

    function testJSInjection() {
        if (!apiBase) return log("⚠️ Skipping JS injection test: no API base found.");
        const script = document.createElement("script");
        const payload = encodeURIComponent("<img src=x onerror=alert('XSS')>");
        script.src = apiBase + "/?test=" + payload;
        document.body.appendChild(script);
        log("Injected script src: " + script.src);
    }

    async function runAllTests() {
        await discoverApiBase();
        sendPostMessage();
        attemptCORSFetch();
        attemptCookieAccess();
        testWindowTop();
        testWindowOpener();
        attemptCookieWrite();
        testLocalStorage();
        testSessionStorage();
        testReferrer();
        testFormSubmission();
        testJSInjection();
        log("🧪 All tests completed.");
    }

    runAllTests();
})();
