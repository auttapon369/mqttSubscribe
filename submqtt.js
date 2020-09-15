var mqtt    = require('mqtt');
var count =0;
var options={
    clientId:"mqttjs01",
    username:"mqtt",
    password:"password",
    clean:true};
var client  = mqtt.connect("mqtt://localhost",options);
console.log("connected flag  " + client.connected);

// mysql
var mysql      = require('mysql');
var connection = mysql.createPool({
  connectionLimit : 10,
  host            : '*******',
  user            : 'root',
  password        : '*******',
  database        : '******'
});


//handle incoming messages
client.on('message',function(topic, message, packet){
 
  
  receiveSplitData(message);
 


  console.log("topic is "+ topic);

});


client.on("connect",function(){	
console.log("connected  "+ client.connected);

})
//handle errors
client.on("error",function(error){
console.log("Can't connect" + error);
process.exit(1)});
//publish
function publish(topic,msg,options){
console.log("publishing",msg);

if (client.connected == true){
	
client.publish(topic,msg,options);

}
count+=1;
if (count==2) //ens script
	clearTimeout(timer_id); //stop timer
	client.end();	
}

//////////////

var options={
retain:true,
qos:1};

var topic="TESTDATA";
var message="test message";
var topic_list=["topic2","topic3","topic4"];
var topic_o={"topic22":0,"topic33":1,"topic44":1};
console.log("subscribing to topics");
client.subscribe(topic,{qos:1}); //single topic


//client.subscribe(topic_list,{qos:1}); //topic list
//client.subscribe(topic_o); //object
//var timer_id=setInterval(function(){publish(topic,message,options);},5000);
//notice this is printed even before we connect
console.log("end of script");

var linePackage = "";
function receiveSplitData(data)
{
  data.forEach(ch => {
    //console.log(ch);
    if (ch != 10) {
      linePackage += String.fromCharCode(ch);
    } else {
     var query = SplitData(linePackage);
     console.log(query);

     connection.query(query, function (error, results, fields) {
      if (error) throw error;
      //console.log('The solution is: ', results[0].solution);
    });

      //console.log(linePackage);
      linePackage = "";
    }
  });
}

function SplitData(data)
{
  var str = data.split(/[' '/,A]/);
  console.log(str);
  var deviceID=str[0];
  var value = str[6];
  var dt = str[1]+'-'+str[2]+'-'+str[3]+' '+str[4];
  var dUpdate =  formatDate();


var insertData="INSERT INTO TTdata(deviceID,dataValue,dataDatetime,dataUpdate,dataStatus)VALUES('"+deviceID+"','"+value+"','"+dt+"','"+dUpdate+"',1)";
return insertData;
}
function formatDate() {
  var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
      h = ' ' + d.getHours();
      mi = ''+d.getMinutes();
      s = d.getSeconds();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  var d = [year, month, day].join('-');
  var t = [h,mi,s].join(':');
  return d+t;
}
