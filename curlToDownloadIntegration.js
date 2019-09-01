//const { Curl } = require('node-libcurl');
const { Curl, CurlFeature } = require('node-libcurl');
const fs = require('fs');

const fileOutPath = './exports/LOADPDHEMEABULKUPDATESBETA_01.00.0000.iar';

const fileOut = fs.openSync(fileOutPath, 'w+')

const curlDownload = new Curl();

curlDownload.setOpt(Curl.option.URL, 'https://swoicdev1-sherwinwilliamsoci.integration.ocp.oraclecloud.com:443/ic/api/integration/v1/integrations/LOADPDHEMEABULKUPDATESBETA|01.00.0000/archive');
//curlDownload.setOpt(Curl.option.USERNAME, '');
curlDownload.setOpt(Curl.option.USERPWD, process.argv[2] + ':' + process.argv[3]);
curlDownload.setOpt(Curl.option.SSL_VERIFYHOST, 0);
curlDownload.setOpt(Curl.option.SSL_VERIFYPEER, 0);
//curlDownload.setOpt(Curl.option.VERBOSE, true);

curlDownload.setOpt(Curl.option.WRITEFUNCTION, (buff, nmemb, size) => {
    let written = 0
  
    if (fileOut) {
      written = fs.writeSync(fileOut, buff, 0, nmemb * size)
    } else {
      /* listing output */
      process.stdout.write(buff.toString())
      written = size * nmemb
    }
  
    return written
  })

curlDownload.enable(CurlFeature.Raw | CurlFeature.NoStorage)

curlDownload.on('end', function(statusCode, data, headers){
    //console.log('End');
    //console.log(statusCode);
    //console.log(data);
    //console.log(headers);

    fs.closeSync(fileOut);

    this.close();

    curlDownload.close.bind(curlDownload);
});

curlDownload.on('error', function(error, errorCode){
    console.log('Error');
    console.log(error);
    console.log(errorCode);
    fs.closeSync(fileOut);
    curlDownload.close();
});

curlDownload.perform();
