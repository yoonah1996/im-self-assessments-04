const { exec } = require('child_process');
const https = require('https');

// Get sutdent data from student.json
let studentInfo = require('../student.json')
let {theClass, student, sprint} = studentInfo

console.log(theClass, student, sprint)

exec('npm test | grep -E \"[0-9]+\\s(passing|failing)\"', (err, stdout1, stderr) => {
    if (err) {
        throw new Error('test did not run correctly')
    }

    // Get test result from the console and cleasing it for spread sheet
    let matchWithPassing = stdout1.match(/([.\d,]+)[ ]+passing/)
    let matchWithFailing = stdout1.match(/([.\d,]+)[ ]+failing/)
    let passing = matchWithPassing ? Number(matchWithPassing[1]) : 0
    let failing = matchWithFailing ? Number(matchWithFailing[1]) : 0

    exec('echo "$airtable_api_key"', (err, apikey) => {
        if (err) {
            console.log(err);
            throw new Error("echo command did not work right");
        }
    
        if (apikey === "\n") {
            throw new Error("There is not the airtable_api_key");
        }

        const options = {
            hostname: 'api.airtable.com',
            path: '/v0/app8kEq9wXlsuffDy/Self%20Assessment',
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: ' Bearer ' + apikey.trim()
            }
        };
        console.log(JSON.stringify(options.headers));
        let data;
    
        const req = https.request(options, (res) => {
            res.on("data", chunk => {
                data += chunk;
                // callback(null, result);
            });
        
            res.on("end", () => {
                console.log(data);
                if (data.includes("error")) {
                throw new Error("There is an error on response from airtable.");
                }
            });
        });
    
        req.on('error', (e) => {
            throw new Error('data did not send to airtable correctlu')
            // callback(new Error('failure'));
        });
        // send the request
        req.write(JSON.stringify({
            'fields': {
                'class': theClass,
                'name':student,
                'sprint': sprint,
                'passed': passing,
                'failed': failing,
            }
        }));
        req.end();
    })
})
