# RFIDMonitor Platform
This project aims to provide a full solution for RFID monitoring. The project is divided in two fundamental parts:
* Collecting Point (Embedded)
  * [RFIDMonitor] [RFIDMonitor]
  * [RFIDMonitorDaemon] [RFIDMonitor]
* Desktop
    * [DeskApp] [RFIDMonitor]
* Server
    * RFIDMonitor Platform

This repository holds the RFIDMonitor Platform code. The system is responsible for communicates with the Collecting Point to exchange information and to save all the collected data into the database. Also offers an RestFul API to consume those data and a web-based user interface for administration.

### Version
1.0.0

### Requirements
- PostgreSQL >= v9.3.6
- NodeJS >= v4.2.2
- Npm >= v2.14.7

### Installation

```sh
$ git clone [git-repo-url] rfidmonitor-platform
$ cd rfidmonitor-platform
$ npm install
$ node app.js
```

[RFIDMonitor]: <https://github.com/CELTAB/rfidmonitor>
