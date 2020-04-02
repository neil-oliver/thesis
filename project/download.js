var fs = require('fs');
var vader = require('vader-sentiment')
const dotenv = require('dotenv')


// AWS Setup
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-2";
AWS.config.update({
    "region": process.env.region,
    "accessKeyId": process.env.accessKeyId,
    "secretAccessKey": process.env.secretAccessKey
});
(async() =>{

    var dynamodb = new AWS.DynamoDB();

    var allData = []

    const getAllData = async (params) => { 

        console.log("Querying Table");
        let data = await dynamodb.scan(params).promise();

        if(data['Items'].length > 0) {
            allData = [...allData, ...data['Items']];
        }

        if (data.LastEvaluatedKey) {
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            return await getAllData(params);

        } else {
            return data;
        }
    }

    try {

        var params = {
            TableName : "thesis",
            // KeyConditionExpression: "#timestamp between :minDate and :maxDate", // the query expression
            // ExpressionAttributeNames: { "#timestamp": "timestamp"},
            // ExpressionAttributeValues: { // the query values
            //     ":minDate": {S: "2019-03-16T00:00:00.000Z"},
            //     ":maxDate": {S: "2020-03-21T23:59:59.000Z"}
            // }
        };

        await getAllData(params);
        // await getAllData(params);

        console.log("Processing Completed");

        fs.writeFile('dynamodb-download.json', JSON.stringify(allData), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });


    } catch(error) {
        console.log(error);
    }
})()