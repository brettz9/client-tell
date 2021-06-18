import postJSON from './node_modules/simple-post-json/dist/index-es.js';
import {jml, $, body} from './node_modules/jamilih/dist/jml-es.js';

const standardHeaders = [
  'Accept', 'Accept-Charset', 'Accept-Encoding', 'Accept-Language',
  'Accept-Datetime', 'Authorization', 'Cache-Control', 'Connection',
  'Connection: Upgrade', 'Permanent', 'Cookie', 'Content-Length',
  'Content-MD5', 'Content-Type', 'Date', 'Expect', 'Forwarded',
  'From', 'Host', 'If-Match', 'If-Modified-Since', 'If-None-Match',
  'If-Range', 'If-Unmodified-Since', 'Max-Forwards', 'Origin',
  'Pragma', 'Proxy-Authorization', 'Range', 'Referer', 'TE',
  'User-Agent', 'Upgrade', 'Via', 'Warning'
];
const nonstandardHeaders = [
  'X-Requested-With', 'DNT', 'X-Forwarded-For', 'X-Forwarded-Host',
  'X-Forwarded-Proto', 'Front-End-Https', 'X-Http-Method-Override',
  'X-ATT-DeviceId', 'X-Wap-Profile', 'Proxy-Connection', 'X-UIDH',
  'X-Csrf-Token', 'X-Request-ID', 'X-Correlation-ID'
];

/**
 *
 * @param {Event} e
 * @returns {Promise<void>}
 */
async function post (e) {
  const url = e.target.value;
  const res = await postJSON({
    url: 'retrieve.js',
    body: {
      url,
      postData: $('#postData').value,
      method: $('#method').value,
      headers: [...$('table.requestHeaders').rows].slice(1).reduce((h, row) => {
        const {cells} = row;
        const headerName = cells[1].querySelector('input').value;
        if (!headerName.trim()) {
          return h;
        }
        h[headerName] = cells[2].querySelector('input').value;
        return h;
      }, {})
    }
  });
  const doc = new DOMParser().parseFromString(res.html, 'text/html');
  if (![...doc.querySelectorAll('base')].some((base) => Boolean(base.href))) {
    doc.head.append(jml('base', {href: url}));
  }
  $('#htmlPreview').replaceWith(jml('iframe', {
    id: 'htmlPreview',
    className: 'htmlPreview',
    srcdoc: doc.documentElement.outerHTML
    // sandbox: 'allow-scripts'
  }));
  $('#htmlText').value = res.html;
  $('#responseHeaders').firstElementChild.replaceWith(jml(
    'table', {className: 'responseHeaders'}, [
      ['tr', [
        ['th', ['Header name']],
        ['th', ['Value']]
      ]],
      ...Object.entries(res.headers).map(([name, val]) => [
        'tr', [
          ['td', [name]],
          ['td', [val]]
        ]
      ])
    ]
  ));
}

/**
 *
 * @returns {JamilihArray}
 */
function createRequestHeaderRow () {
  return ['tr', [
    ['td', [
      ['button', {$on: {click () {
        $('table.requestHeaders').append(
          jml(...createRequestHeaderRow())
        );
      }}}, ['+']],
      ['button', {$on: {click (e) {
        if ($('table.requestHeaders').rows.length > 2) {
          e.target.parentNode.parentNode.remove();
        }
      }}}, ['-']]
    ]],
    ['td', [
      ['input', {list: 'datalist'}]
    ]],
    ['td', [
      ['input']
    ]]
  ]];
}

jml('div', {className: 'ancestor'}, [
  ['div', {className: 'ancestor'}, [

    ['label', {className: 'col'}, [
      ['div', {className: 'urlCol'}, ['URL ']],
      ['input', {className: 'urlCol', type: 'url', $on: {change: post}}],
      ['div', [
        ['label', [
          'Post body',
          ['textarea', {id: 'postData', style: 'height: 100px; width: 100%;'}]
        ]]
      ]],
      ['div', [
        ['label', [
          'HTTP Method: ',
          ['select', {id: 'method'}, [
            ['option', ['GET']],
            ['option', ['HEAD']],
            ['option', ['POST']],
            ['option', ['PUT']],
            ['option', ['DELETE']],
            ['option', ['CONNECT']],
            ['option', ['OPTIONS']],
            ['option', ['TRACE']],
            ['option', ['PATCH']]
          ]]
        ]]
      ]]
    ]],
    ['div', {id: 'requestHeaders', className: 'col requestHeaders'}, [
      ['datalist', {id: 'datalist'}, [...standardHeaders, ...nonstandardHeaders].map(
        (header) => ['option', [header]]
      )],
      ['table', {className: 'requestHeaders'}, [
        ['tr', [
          ['th'],
          ['th', [
            'Request header'
          ]],
          ['th', [
            'Value'
          ]]
        ]],
        createRequestHeaderRow()
      ]]
    ]],

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
], body);
