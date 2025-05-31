# iframe-test

A simple 2x2 grid testbed for web application security testing, focused on iframe-based attacks like XSS, CORS, Clickjacking, and CSRF. Part of the mikesploitsec project.

## Purpose

This testbed loads multiple websites in a grid layout to simulate realistic cross-origin scenarios, enabling:

- CORS and SameSite cookie testing
- Clickjacking testing
- Embedded content analysis
- Malicious iframe behavior simulation

## Setup

Clone the repo and open `index.html` locally. This project is designed for **local testing** only.

## Hosted Attack Site

For proper cross-origin testing, a malicious iframe payload is hosted at:

[https://mikesploitsec.github.io/iframe-attack-site/](https://mikesploitsec.github.io/iframe-attack-site/)

## License

MIT
