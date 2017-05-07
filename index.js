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
            className: 'htmlPreview',
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
    ['div', {className: 'ancestor'}, [

        ['label', {className: 'col'}, [
            ['div', {className: 'innerCol'}, ['URL ']],
            ['input', {className: 'innerCol', type: 'url', $on: {change: post}}]
        ]],
        ['textarea', {id: 'requestHeaders', placeholder: '(Request headers) (NOT YET IMPLEMENTED)', className: 'col requestHeaders'}],

        ['textarea', {id: 'htmlText', placeholder: '(Response body)', className: 'col'}],
        ['div', {id: 'responseHeaders', className: 'col responseHeaders'}, [
            ['span', {className: 'placeholder'}, ['(Response headers)']]
        ]],

        ['div', {className: 'ancestor'}, [
            ['div', {id: 'htmlPreview', className: 'placeholder htmlPreview'}, [
                '(Preview)'
            ]]
        ]]
    ]]
], document.body);
