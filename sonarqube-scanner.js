const scanner = require('sonarqube-scanner');
scanner(
  {
  serverUrl: "http://localhost:9000"
},
() => process.exit()
);