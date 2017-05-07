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
        $('#responseHeaders').value = JSON.stringify(res.headers, null, 4);
        console.log('res', res);
    });
}

jml('div', {className: 'ancestor'}, [
    ['style', [`
        html, body, .ancestor {height: 100%; margin-top: 0px; margin-bottom: 0px;}
        .col {
            float: left;
            height: calc(33% - 2px);
            padding: 0px;
            width: 50%;
        }
        textarea.col {
            width: calc(50% - 2px);
        }
        #htmlPreview {
            height: calc(33% - 2px);
            width: 100%;
        }
    `]],
    ['div', {className: 'ancestor'}, [

        ['label', {className: 'col'}, [
            ['br'],
            'URL ',
            ['input', {type: 'url', $on: {change: post}}]
        ]],
        ['textarea', {id: 'requestHeaders', placeholder: '(Request headers) (NOT YET IMPLEMENTED)', className: 'col'}],

        ['textarea', {id: 'htmlText', placeholder: '(Response body)', className: 'col'}],
        ['textarea', {id: 'responseHeaders', placeholder: '(Response headers)', className: 'col'}],

        ['div', {className: 'ancestor'}, [
            ['div', {id: 'htmlPreview', style: 'color: gray; font-size: small; display: inline-block; border-collapse: collapse; border: 1px solid gray;'}, [
                '(Preview)'
            ]]
        ]]
    ]]
], document.body);
