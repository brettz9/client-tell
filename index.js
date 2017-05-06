/* eslint-env browser */
/* globals postJSON, jml */
function $ (sel) {
    return document.querySelector(sel);
}
function replace (oldNode, newNode) {
    return oldNode.parentNode.replaceChild(newNode, oldNode);
}
function post (e) {
    const url = e.target.value;
    postJSON({
        url: 'retrieve.js',
        body: {url}
    }).then(function (res) {
        const doc = new DOMParser().parseFromString(res.html, 'text/html');
        if (!Array.from(doc.querySelectorAll('base')).some((base) => !!base.href)) {
            doc.head.appendChild(jml('base', {href: url}));
        }
        replace($('#htmlPreview'), jml('iframe', {
            id: 'htmlPreview',
            srcdoc: doc.documentElement.outerHTML
            // sandbox: 'allow-scripts'
        }));
        $('#htmlText').value = res.html;
        $('#headers').value = JSON.stringify(res.headers, null, 4);
        console.log('res', res);
    });
}

jml('div', [
    ['style', [`
        textarea { width: 400px; height: 280px; }
    `]],
    ['label', [
        'URL ',
        ['input', {type: 'url', $on: {click: post}}],
        ['div', {id: 'htmlPreview'}],
        ['textarea', {id: 'htmlText'}],
        ['textarea', {id: 'headers'}]
    ]]
], document.body);
