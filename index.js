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
        replace($('#responseHeaders').firstElementChild, jml('table', {className: 'headers'}, [
            ['tr', [
                ['th', ['Header name']],
                ['th', ['Value']]
            ]],
            {'#': Object.entries(res.headers).map(([name, val]) =>
                ['tr', [
                    ['td', [name]],
                    ['td', [val]]
                ]]
            )}
        ]));
        console.log('res', res);
    });
}

jml('div', {className: 'ancestor'}, [
    ['style', [`
        html, body, .ancestor {height: 100%; margin-top: 0px; margin-bottom: 0px;}
        .col {
            float: left;
            width: 50%;
            height: calc(33% - 2px);
            padding: 0px;
        }
        #responseHeaders {
            overflow: auto;
        }
        .headers {
            width: 100%;
        }
        .headers, .headers tr, .headers th, .headers td {
            border: 1px solid black;
            border-collapse: collapse;
            border-spacing: 0px;
            padding: 2px;
            margin: 0px;
        }
        textarea.col {
            width: calc(50% - 2px);
        }
        div.innerCol {display: inline-block; padding-right: 10px;}
        input.innerCol {width: 80%;}
        .innerCol {
            margin-top: 10px;
            padding: 0px;
        }
        #htmlPreview {
            height: calc(33% - 2px);
            width: 100%;
        }
        .placeholder {color: gray; font-size: small;}
    `]],
    ['div', {className: 'ancestor'}, [

        ['label', {className: 'col'}, [
            ['div', {className: 'innerCol'}, ['URL ']],
            ['input', {className: 'innerCol', type: 'url', $on: {change: post}}]
        ]],
        ['textarea', {id: 'requestHeaders', placeholder: '(Request headers) (NOT YET IMPLEMENTED)', className: 'col'}],

        ['textarea', {id: 'htmlText', placeholder: '(Response body)', className: 'col'}],
        ['div', {id: 'responseHeaders', className: 'col'}, [
            ['span', {className: 'placeholder'}, ['(Response headers)']]
        ]],

        ['div', {className: 'ancestor'}, [
            ['div', {id: 'htmlPreview', className: 'placeholder', style: 'display: inline-block; border-collapse: collapse; border: 1px solid gray;'}, [
                '(Preview)'
            ]]
        ]]
    ]]
], document.body);
