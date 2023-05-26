const fetch = require('node-fetch')
const sendSMS = async(num, message) => {
    const url = `https://api.bulksmslive.com/v2/app/sms?email=eaogolekwu@gmail.com&password=smslive1x@&message=${message}&sender_name=ResidentPro&recipients=${num}&forcednd=1`
    try{
        const tr = await fetch(url)
        const res = await tr.json()
        return res
    }catch(e){
        return res.status(403).json({message:e})
        console.log(e)
    }
    
}

module.exports = sendSMS
