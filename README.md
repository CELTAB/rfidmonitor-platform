# RFIDMonitor Platform

The RFIDMonitor Platform is part of the RFIDMonitor project, and provides a prototype application for the server side of the RFID monitoring environment.

The RFIDMonitor project is divided in three main applications:
* RFIDMonitor: an app that runs over Raspberry Pi on collecting points.
* RFIDMonitor DeskApp: an app that runs over Desktops, and is prepared to configure the collecting point.
* RFIDMonitor Platform: [current repository] an app that runs on server side and connects with every collecting point, synchronize the monitoring data, holds the data in a database, provides a Restful API for manageble clients, and serves a web application for the platform administration and data visualization.

### Version
1.0.0 alpha

### Requirements
- PostgreSQL >= v9.3.6
- NodeJS >= v4.2.2
- Npm >= v2.14.7

### Installation

```sh
$ git clone [git-repo-url] rfidmonitor-platform
$ cd rfidmonitor-platform
$ npm run deploy
$ node app.js
```
