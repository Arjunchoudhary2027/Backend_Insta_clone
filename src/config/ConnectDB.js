const mongoose = require('mongoose');
    const dns = require('dns');
    
    dns.setServers([
        '1.1.1.1', //Cloudflare dns
        '8.8.8.8' //google dns
    ])
async function connectToDB(){
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB');
    
}
module.exports = connectToDB;
