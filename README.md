# Hotspot
A simple hotspot service written in Node.js. Compatible with Ruckus Zoneflex.


## Introduction

The hotspot service is a 2 parter:
- A simple page that acts a so-called captive portal. Here you can enter a daily code.
- A Radius server that checks if the user can access the internet.

## Installation on your server

Make sure node.js is installed.

To install the depedancies, run

	npm install

To run the code, run

	node app

Make sure you have an Apache or Nginx reverse proxy which takes care of https. For a free and easy https setup, you can use Let's Encrypt:

- [Set up Nginx with Let's Encrypt on Debian 9](https://certbot.eff.org/lets-encrypt/debianstretch-nginx.html)
- [Set up Apache with Let's Encrypt on Debian 9](
https://certbot.eff.org/lets-encrypt/debianstretch-apache)


## Installation on the Ruckus Zoneflex

I'm using a Ruckus Zoneflex 7363. These are very decent wifi access points and are easy to find on Ebay for not that much money.

To configure the hotspot, first go Configuration -> Hotspot. Change the following:

- Hotspot service: **Enabled**
- Redirect unauth. user to:: ***the url of this hotspot service (must be https).***
- Primary RADIUS Server: ***the ip address of the server running this hotspot service.***
- RADIUS Server Secret:	**radius_secret** (currently hardcoded in app.js)
- Walled Garden: add new entry: ***the ip or hostname of the server running this hotspot service.***

Next, go to Configuration -> Radio 2.4G or Radio 5G and pick a free wifi radio. Change the following:

- Wireless Availability?: **Enabled**
- SSID: ***choose a name for your hotspot wifi***
- Hotspot Service: **hotspot0**


That's it. If all goes well, you should find a new wifi hotspot which loads a captive portal asking for a daily code. Go to https://yourserver/admin to get that code.

Good luck!



## Lisence

BSD 3-Clause License

Copyright (c) 2018, Sam
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

