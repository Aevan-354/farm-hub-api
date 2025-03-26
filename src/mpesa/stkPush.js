const axios = require('axios');
const auth = require('./mpesaAuth'); // Ensure this path is correct

const stkPush = async () => {
    const token = await auth(); // Fetch the latest access token
    const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    const requestData = {
        BusinessShortCode: "174379",
        Password: "your_encoded_password",
        Timestamp: "your_timestamp",
        TransactionType: "CustomerPayBillOnline",
        Amount: "1",
        PartyA: "your_phone_number",
        PartyB: "174379",
        PhoneNumber: "your_phone_number",
        CallBackURL: "https://your_callback_url.com",
        AccountReference: "Test",
        TransactionDesc: "Payment"
    };

    try {
        const response = await axios.post(url, requestData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("STK Push Response:", response.data);
    } catch (error) {
        console.error("Error in STK Push:", error.response?.data || error.message);
    }
};

stkPush();
