const fetch = require('node-fetch')
const sendSMS = async(num, message) => {
//     const url = `https://api.bulksmslive.com/v2/app/sms?email=eaogolekwu@gmail.com&password=smslive1x@&message=${message}&sender_name=ResidentPro&recipients=${num}&forcednd=1`
//     try{
//         const tr = await fetch(url)
//         const res = await tr.json()
//         return res
//     }catch(e){
//         return res.status(403).json({message:e})
//         console.log(e)
//     }
    
    fetch('https://www.bulksmsnigeria.com/api/v2/sms', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        body: message,
        from: "ResidentPro",
        to: num,
        api_token: "H0SJvKTktd0S1BNw03RxXGCXlaSgBbk4V0c2dGGPljXSg6goc7tNapPnaB0j",
        gateway: "direct-refund"
      })
    })
      .then(response => response.json())
      .then(data => {
        return res
      })
      .catch(e => {
        console.log(error);
        return res.status(403).json({message:e})
      });
}

module.exports = sendSMS
