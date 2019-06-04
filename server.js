/* eslint-disable import/unambiguous, import/no-commonjs, no-console */
const port = 8085;

const http = require('http');
const https = require('https');
const fs = require('fs');

/**
 *
 * @param {Stream} stream
 * @returns {Promise<string>}
 */
function stringifyStream (stream) {
    // eslint-disable-next-line promise/avoid-new
    return new Promise((resolve, reject) => {
        let chnks = '';
        stream.on('data', (chnk) => {
            chnks += chnk;
        });
        stream.on('end', () => {
            resolve(chnks);
        });
        stream.on('error', (err) => {
            reject(err);
        });
    });
}

/**
 * @todo Use a proper tool
 * @param {string} file
 * @returns {string} Content-type
 */
function getContentTypeForFileByExtension (file) {
    let contentType;
    switch (file.match(/(\.[^.]*)?$/u)[0]) {
    default:
        throw new TypeError('Unknown content type for file ' + file);
    case '.ico':
        break;
    case '.html':
        contentType = 'text/html';
        break;
    case '.css':
        contentType = 'text/css';
        break;
    case '.js':
        contentType = 'text/javascript';
        break;
    }
    return contentType;
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
async function retrieveURLAndHeaders (req, res) {
    let requestedInfo = await stringifyStream(req);
    try {
        requestedInfo = JSON.parse(requestedInfo);
    } catch (err) {
        console.log('JSON parsing error:', err);
        return;
    }
    if (!requestedInfo.url.trim()) {
        return;
    }
    Object.keys(requestedInfo.headers).forEach((headerName) => {
        if (!headerName.trim()) { // Empty headers give error
            delete requestedInfo.headers[headerName];
        }
    });
    const urlObj = new URL(requestedInfo.url);
    const {method} = requestedInfo;

    const opts = {
        hostname: urlObj.hostname,
        // family: 4 // or 6 (ipv)
        // agent:
        // timeout:
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method, // Defaults to GET
        headers: requestedInfo.headers
    };
    const protocol = urlObj.protocol === 'https:' ? https : http;
    const rq = protocol.get(opts, async (resp) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

        resp.setEncoding('utf8');
        const chunks = await stringifyStream(resp);
        const ret = {html: chunks, ok: true, headers: resp.headers};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(ret));
    });
    rq.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });
}

http.createServer((req, res) => {
    const {url} = req;
    if (url === '/retrieve.js') {
        retrieveURLAndHeaders(req, res);
        return;
    }
    const extra = url === '/' ? 'index.html' : '';
    const filePath = './' + url.replace(/^\//u, '') + extra;

    const contentType = getContentTypeForFileByExtension(filePath);
    if (!contentType) { // e.g., favicon
        return;
    }
    res.setHeader('Content-Type', contentType);

    // Suppressing alert in next code line comment due to filtering being in place above
    const s = fs.createReadStream(filePath); // lgtm [js/path-injection]
    s.pipe(res);
    s.on('error', (err) => {
        console.log('err', err);
    });
}).listen(port);
console.log('Started server; open http://localhost:' + port + ' in the browser');
