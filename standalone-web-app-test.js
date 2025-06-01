// 🧪 Mikesploit Web App Security Test Suite (v3.1)
// Paste into any browser console for ethical recon and security testing.

(() => {
    console.log("🧪 Mikesploit Web App Security Test Suite: Starting...");

    const targetOrigin = window.location.origin;
    let apiBase = null;

    const commonApiEndpoints = [
        "/api", "/api/v1", "/api/v2", "/v1", "/v2", "/rest", "/graphql",
        "/openai", "/chatbot", "/data", "/backend", "/auth", "/config",
        "/status", "/health", "/docs"
    ];

    const interestingHeaders = [
        "access-control-allow-origin", "access-control-allow-credentials",
        "content-security-policy", "strict-transport-security",
        "x-frame-options", "x-content-type-options",
        "referrer-policy", "permissions-policy"
    ];

    function log(msg) {
        console.log(`[TestLog] ${msg}`);
    }

    function checkForApacheHTML(content) {
        if (content.includes('<title>Index of') || content.includes('Apache/')) {
            log('⚠️ Server returned an Apache-style HTML page (likely a directory listing or 404).');
            const preview = content.slice(0, 300).replace(/\n/g, '');
            log(`HTML Preview: ${preview}...`);
        }
    }

    async function discoverApiBase() {
        log("🔎 Discovering API base...");
        for (let path of commonApiEndpoints) {
            const url = targetOrigin + path;
            try {
                const res = await fetch(url, {
                    method: 'GET',
                    mode: 'cors',
                    headers: { 'User-Agent': 'Mikesploit-Security-Test/1.0 (ethical recon; contact: mikesploit@proton.me)' }
                });
                const status = res.status;
                const statusText = res.statusText;
                log(`🟡 Probed ${url} - Status: ${status} ${statusText}`);

                const headers = {};
                interestingHeaders.forEach(h => {
                    const val = res.headers.get(h);
                    if (val) headers[h] = val;
                });
                if (Object.keys(headers).length > 0) {
                    log(`🔍 Headers for ${url}:`);
                    console.table(headers);
                }

                if (res.ok) {
                    apiBase = url;
                    log(`✅ API base selected: ${apiBase}`);
                }
            } catch (e) {
                log(`❌ Probe error for ${url}: ${e}`);
            }
            // Delay between probes
            await new Promise(r => setTimeout(r, 250));
        }
        if (!apiBase) log("❌ No API base found; tests will proceed without dynamic endpoint.");
    }

    function sendPostMessage() {
        parent.postMessage('Test message from Console Test Suite', '*');
        log('Sent postMessage to parent.');
    }

    function attemptCORSFetch() {
        if (!apiBase) return log("⚠️ Skipping CORS fetch: no API base found.");
        fetch(apiBase, { mode: 'cors' })
            .then(response => response.text())
            .then(data => {
                log('CORS Fetch Success: ' + data);
                checkForApacheHTML(data);
            })
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
        try { localStorage.setItem("testKey", "testValue"); log("localStorage test: " + localStorage.getItem("testKey")); }
        catch (err) { log("localStorage access error: " + err); }
    }

    function testSessionStorage() {
        try { sessionStorage.setItem("testKey", "testValue"); log("sessionStorage test: " + sessionStorage.getItem("testKey")); }
        catch (err) { log("sessionStorage access error: " + err); }
    }

    function testReferrer() {
        log("document.referrer: " + document.referrer);
    }

    function testFormSubmission() {
        if (!apiBase) return log("⚠️ Skipping form test: no API base found.");
        fetch(apiBase + "/test-form", { method: "POST", mode: "cors" })
            .then(res => res.text())
            .then(data => {
                log('Form POST response: ' + data);
                checkForApacheHTML(data);
            })
            .catch(err => log(`Form POST error: ${err}`));
    }

    function testJSInjection() {
        if (!apiBase) return log("⚠️ Skipping JS injection test: no API base found.");
        const script = document.createElement("script");
        const payload = encodeURIComponent("<img src=x onerror=alert('XSS')>");
        script.src = apiBase + "/?test=" + payload;
        document.body.appendChild(script);
        log("Injected script src: " + script.src);
        fetch(script.src, { mode: 'cors' })
            .then(res => res.text())
            .then(data => {
                log('JS Injection Response: ' + data);
                checkForApacheHTML(data);
            })
            .catch(err => log(`JS Injection error: ${err}`));
    }

    function testHealthEndpoint() {
        if (!apiBase) return log("⚠️ Skipping health test: no API base found.");
        fetch(apiBase + '/health', { mode: 'cors' })
            .then(response => response.text())
            .then(data => {
                log('Health endpoint response: ' + data);
                checkForApacheHTML(data);
            })
            .catch(err => log('Health endpoint error: ' + err));
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
        testHealthEndpoint();
        log("🧪 All tests completed.");
    }

    runAllTests();
})();
