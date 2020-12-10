
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (req, res) => {
  const { priceId } = req.body;
  const { user } = req.clientContext;

  // See https://stripe.com/docs/api/checkout/sessions/create
  // for additional parameters to pass.
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      metadata: {
        user_id: user.sub,
        user_email: user.email,
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: 'https://slapper.io/s/profile?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://slapper.io/s/profile',
    });

    res.send({
      sessionId: session.id,
    });
  } catch (e) {
    console.log("error", e.message)
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      }
    });
  }
}
