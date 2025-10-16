// eslint-disable-next-line import/no-unresolved -- Bug?
import postJSON from 'simple-post-json';
import {jml, body} from 'jamilih';

/**
 * @param {string} sel
 */
const $ = (sel) => {
  return /** @type {HTMLElement} */ (document.querySelector(sel));
};

/**
 * @param {string} sel
 */
const $i = (sel) => {
  return /** @type {HTMLInputElement} */ (document.querySelector(sel));
};

/**
 * @param {string} sel
 */
const $ta = (sel) => {
  return /** @type {HTMLTableElement} */ (document.querySelector(sel));
};

/**
 * @param {string} sel
 */
const $te = (sel) => {
  return /** @type {HTMLTextAreaElement} */ (document.querySelector(sel));
};

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
  const url = /** @type {EventTarget & {value: string}} */ (e.target).value;
  const res = await postJSON({
    url: 'retrieve.js',
    body: {
      url,
      postData: $te('#postData').value,
      method: $i('#method').value,
      headers: [
        ...$ta('table.requestHeaders').rows
      ].slice(1).reduce((h, row) => {
        const {cells} = row;
        const headerName = /** @type {HTMLInputElement} */ (
          /** @type {HTMLElement} */ (
            cells[1]
          ).querySelector('input')
        ).value;
        if (!headerName.trim()) {
          return h;
        }
        h[headerName] = /** @type {HTMLInputElement} */ (
          cells[2].querySelector('input')
        ).value;
        return h;
      // eslint-disable-next-line jsdoc/imports-as-dependencies -- Bug
      }, /** @type {import('simple-post-json').Headers} */ ({}))
    }
  });
  const doc = new DOMParser().parseFromString(res.html, 'text/html');
  if (doc.head) {
    if (![...doc.querySelectorAll('base')].some((base) => Boolean(base.href))) {
      doc.head.append(jml('base', {href: url}));
    }
    $('#htmlPreview').replaceWith(jml('iframe', {
      id: 'htmlPreview',
      className: 'htmlPreview',
      srcdoc: doc.documentElement.outerHTML
      // sandbox: 'allow-scripts'
    }));
  }
  $te('#htmlText').value = res.html;
  /** @type {HTMLSpanElement} */
  (/** @type {HTMLDivElement} */
    ($('#responseHeaders')).firstElementChild).replaceWith(jml(
    'table', {className: 'responseHeaders'}, [
      ['tr', [
        ['th', ['Header name']],
        ['th', ['Value']]
      ]],
      ...Object.entries(
        res.headers
      ).map(([name, val]) => /** @type {import('jamilih').JamilihArray} */ ([
        'tr', [
          ['td', [name]],
          ['td', [val]]
        ]
      ]))
    ]
  ));
}

/**
 *
 * @returns {import('jamilih').JamilihArray}
 */
function createRequestHeaderRow () {
  return ['tr', [
    ['td', [
      ['button', {$on: {click () {
        $ta('table.requestHeaders').append(
          jml(...createRequestHeaderRow())
        );
      }}}, ['+']],
      ['button', {$on: {click (e) {
        if ($ta('table.requestHeaders').rows.length > 2) {
          /** @type {HTMLElement} */
          (/** @type {HTMLElement} */
            (e.target.parentNode).parentNode).remove();
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
      ['datalist', {
        id: 'datalist'
      }, [...standardHeaders, ...nonstandardHeaders].map(
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

    ['textarea', {
      id: 'htmlText', placeholder: '(Response body)', className: 'col'
    }],
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
