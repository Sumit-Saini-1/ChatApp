const fs=require("fs");
const Data={};

function readData(){
    usersData=JSON.parse(fs.readFileSync("./msgdata.json","utf-8"));
}

function storeMsg(msgobj){
    readData();
    const id1=msgobj.sendBy+msgobj.sendTo;
    const id2=msgobj.sendTo+msgobj.sendBy;
    if(Data[id1]){
        Data[id1].push(msgobj);
    }
    else if(Data[id2]){
        Data[id2].push(msgobj);
    }
    else{
        Data[id1]=[];
        Data[id1].push(msgobj);
    }
    fs.writeFileSync("./msgdata.json",JSON.stringify(Data,null,1));
}
function getData(userName,fUserName){
    readData();
    const id1=userName+fUserName;
    const id2=fUserName+userName;
    if(Data[id1]){
        return Data[id1];
    }
    else if(Data[id2]){
        return Data[id2];
    }
}

module.exports={
    storeMsg,
    getData
};