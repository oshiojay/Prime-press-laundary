exports.emailTemplate = (fullName, otp)=>{
return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
    <title>your otp?</title>
<body>
    <div class="main-section">
        <div class="upper-div">
            <div class="upper-div-1">
                <h1>Email OTP Verification</h1>
                <h3>Hello, ${fullName}</h3>
                <p>Below is your one time passcode that you need to use to complete your authentication. The verification code will be valid for 60 seconds. Please do not share this code with anyone.</p>
            </div>
            <div class="upper-div-2">
                <h2> ${otp} </h2>
            </div>
            <div class="upper-div-3">
                <p>If you are having any issues with your account, please don't hesitate to contact us.</p>
                <p>Enjoy the fastest & most secure way to buy Airtime, Mobile Data & to pay Bills.</p>
            </div>
        </div>
        <div class="downer-div">
            <p>If you would like to know more about our services, please also refer to Helpcenter</p>
            <p>Splita Team</p>
        </div>
    </div>
</body>
</html>`
}
