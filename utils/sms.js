const fetch = require('node-fetch')
const sendSMS = async(num, message) => {
    const url = `https://app.multitexter.com/v2/app/sms?email=eaogolekwu@gmail.com&password=multitxt1x@&message=${message}&sender_name=IPSS&recipients=${num}&forcednd=1`
    try{
        const tr = await fetch(url)
        const res = await tr.json()
        return res
    }catch(e){
        console.log(e)
    }
    
}

module.exports = sendSMS