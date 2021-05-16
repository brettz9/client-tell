[![npm](https://img.shields.io/npm/v/client-tell.svg)](https://www.npmjs.com/package/client-tell)
[![Dependencies](https://img.shields.io/david/brettz9/client-tell.svg)](https://david-dm.org/brettz9/client-tell)
[![devDependencies](https://img.shields.io/david/dev/brettz9/client-tell.svg)](https://david-dm.org/brettz9/client-tell?type=dev)

[![Known Vulnerabilities](https://snyk.io/test/github/brettz9/client-tell/badge.svg)](https://snyk.io/test/github/brettz9/client-tell)
[![Total Alerts](https://img.shields.io/lgtm/alerts/g/brettz9/client-tell.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/brettz9/client-tell/alerts)
[![Code Quality: Javascript](https://img.shields.io/lgtm/grade/javascript/g/brettz9/client-tell.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/brettz9/client-tell/context:javascript)

# client-tell

Simple HTTP client app in HTML/Node

## Screenshots

![Main page](./screenshots/main.png)

# Installation

`npm i`

# Setup

1. `npm start`
2. Follow instructions on URL to open in browser

# Todos

1. Allow extensions (e.g., to have a special interface for running
    [HTTPQuery](https://github.com/brettz9/httpquery) which should itself be
    upgraded to utilize, support non-eval JSONPath, and also run as middleware
    (demo using [htteepee](https://github.com/brettz9/htteepee)))
    1. Might leverage
        [Link-Template](https://tools.ietf.org/html/draft-nottingham-link-template-01)
        to provide simple forms
    1. Essentially replace my old XSLT/XQuery add-ons with an area
        for evaluating JavaScript, perhaps preloading
        [jtlt](https://github.com/brettz9/jtlt) combined with
        syntax to make CORS (or proxified) HTTPQuery to retrieve
        JSONPath/CSS Selectors/XPath results and transform.
1. Allow for prepopulating based on reading in file format via webappfind
    (and add this repo to
    [webappfind-demos-samples](https://github.com/brettz9/webappfind-demos-samples))
1. Add Cypress tests for UI and server
