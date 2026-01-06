const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

mercadopago.configure({
      access_token: ACCESS_TOKEN
});

app.post('/criar-pagamento', async (req, res) => {
      try {
                const { robux, price, email, username } = req.body;
                const payment_data = {
                              transaction_amount: parseFloat(price),
                              description: robux + ' Robux - RobuxPremium',
                              payment_method_id: 'pix',
                              payer: { email: email, first_name: username }
                };
                const payment = await mercadopago.payment.create(payment_data);
                res.json({ success: true, qr_code: payment.body.point_of_interaction.transaction_data.qr_code });
      } catch (error) {
                res.status(500).json({ success: false, error: error.message });
      }
});

app.get('/', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
