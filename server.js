const port = 8085;

const http = require('http');
const https = require('https');
const url = require('url');

function stringifyStream (stream) {
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

function getContentTypeForFileByExtension (file) {
    let contentType;
    switch (file.match(/(\.[^.]*)?$/)[0]) {
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

function retrieveURLAndHeaders (req, res) {
    return stringifyStream(req).then((requestedInfo) => {
        try {
            requestedInfo = JSON.parse(requestedInfo);
        } catch (err) {
            console.log('JSON parsing error: ', err);
            return;
        }
        if (!requestedInfo.url.trim()) {
            return;
        }
        Object.keys(requestedInfo.headers).some((headerName) => {
            if (!headerName.trim()) { // Empty headers give error
                delete requestedInfo.headers[headerName];
            }
        });
        const urlObj = url.parse(requestedInfo.url);

        const opts = {
            hostname: urlObj.hostname,
            // family: 4 // or 6 (ipv)
            // agent:
            // timeout:
            port: urlObj.port,
            path: urlObj.path,
            method: 'GET',
            headers: requestedInfo.headers
        };
        const protocol = urlObj.protocol === 'https:' ? https : http;
        const req = protocol.get(opts, (resp) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

            resp.setEncoding('utf8');
            stringifyStream(resp).then((chunks) => {
                const ret = {html: chunks, ok: true, headers: resp.headers};
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(ret));
            });
        });
        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });
    });
}

http.createServer((req, res) => {
    const url = req.url;
    if (url === '/retrieve.js') {
        return retrieveURLAndHeaders(req, res);
    }
    const extra = url === '/' ? 'index.html' : '';
    const filePath = './' + url.replace(/^\//, '') + extra;

    const contentType = getContentTypeForFileByExtension(filePath);
    res.setHeader('Content-Type', contentType);

    const s = require('fs').createReadStream(filePath);
    s.pipe(res);
    s.on('error', (err) => {
        console.log('err', err);
    });
}).listen(port);
console.log('Started server; open http://localhost:' + port + ' in the browser');
