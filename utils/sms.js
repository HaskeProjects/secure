const sendSMS = async(num, message) => {
    const url = 'https://app.multitexter.com/v2/app/sendsms';
    try{
        const data = { 
            email: '',
            password: '',
            message,
            sender_name: '',
            recipients: num
        }

        const fetchData = {
        method: 'POST',
        body: data,
        headers: new Headers()
        }

        const tr = await fetch(url, fetchData)
        const res = await tr.json()
        return res
    }catch(e){
        console.log(e)
    }
    
}

module.exports = sendSMS