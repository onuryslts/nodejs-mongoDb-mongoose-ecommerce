const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnect = (callback)=>{
    //MongoClient.connect('mongodb://localhost/node-app')
    MongoClient.connect('mongodb+srv://onuryslts:j3Tr2L6XYnQMh0y3@cluster0.5h71pxl.mongodb.net/node-app?retryWrites=true&w=majority')
        .then(client =>{
            console.log('connected');
            _db = client.db();
            callback();

        })
        .catch(err =>{
            console.log(err);
            throw err;
        })
}
const getdb = ()=>{
    if(_db) {
        return _db;
    }
    throw 'No Database';
}
exports.mongoConnect = mongoConnect;
exports.getdb = getdb;


//MY SQL BAĞLANTISI
// const Sequelize=require('sequelize');
// const sequelize=new Sequelize('node-app','root','12345',{
//     dialect:'mysql',
//     host:'localhost'
// });
// module.exports=sequelize;