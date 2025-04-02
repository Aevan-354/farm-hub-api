const pool = require("../db");
const axios = require("axios");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// FUNCTION TO GENERATE MPESA ACCESS TOKEN
const getMpesaAccessToken = async () => {
  try {
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");

    const response = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: `Basic ${auth}` },
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching M-Pesa access token:", error.message);
    throw new Error("Failed to generate M-Pesa token");
  }
};

// INITIATE M-PESA STK PUSH PAYMENT
const initiateMpesaPayment = async (req, res) => {
  try {
    const { land_id, amount, phone_number } = req.body;
    const user_id = req.user.id;
    const transaction_id = uuidv4(); // Generate unique transaction ID

    // Validate input
    if (!land_id || !amount || !phone_number) {
      return res.status(400).json({ message: "Land ID, amount, and phone number are required" });
    }

    const access_token = await getMpesaAccessToken();

    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64");

    const stkRequest = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone_number,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phone_number,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: "FarmHub Payment",
      TransactionDesc: "Payment for land lease",
    };

    const stkResponse = await axios.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", stkRequest, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (stkResponse.data.ResponseCode === "0") {
      // Save pending transaction in DB
      const query = `
        INSERT INTO payments (user_id, land_id, amount, payment_method, status, transaction_id)
        VALUES ($1, $2, $3, 'mpesa', 'pending', $4)
        RETURNING *;
      `;
      const values = [user_id, land_id, amount, transaction_id];
      await pool.query(query, values);

      res.status(201).json({
        message: "M-Pesa payment initiated",
        transaction_id,
        checkout_request_id: stkResponse.data.CheckoutRequestID,
      });
    } else {
      res.status(400).json({ message: "M-Pesa STK Push failed", error: stkResponse.data });
    }
  } catch (error) {
    console.error("M-Pesa STK Push Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// HANDLE MPESA CALLBACK RESPONSE
const handleMpesaCallback = async (req, res) => {
  try {
    const callbackData = req.body.Body.stkCallback;
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callbackData;

    if (ResultCode === 0) {
      const amount = CallbackMetadata.Item.find((item) => item.Name === "Amount").Value;
      const transaction_id = CallbackMetadata.Item.find((item) => item.Name === "MpesaReceiptNumber").Value;

      // Update payment status
      const query = `
        UPDATE payments SET status = 'completed', transaction_id = $1
        WHERE payment_method = 'mpesa' AND status = 'pending'
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [transaction_id]);

      console.log("M-Pesa Payment Successful:", rows[0]);
    } else {
      console.error("M-Pesa Payment Failed:", ResultDesc);
    }

    res.status(200).json({ message: "Callback received" });
  } catch (error) {
    console.error("M-Pesa Callback Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const myTransactions =async (req, res) =>{
  const user_id =req.params.id

  const query = `
            SELECT 
                payments.id AS p_id,
                payments.amount as p_amount,
                payments.status as p_status,
                payments.created_at as p_created_at,
                users.created_at as p_created_at
                lands.id,
                lands.title,
                lands.location,
                lands.price,
                lands.size,
                lands.description,
                lands.image_url,
                lands.created_at,
                lands.available
            FROM bids
            INNER JOIN lands ON lands.id = bids.land_id
            WHERE bids.user_id = $1
            ORDER BY lands.created_at DESC`
}

module.exports = { initiateMpesaPayment, handleMpesaCallback };
