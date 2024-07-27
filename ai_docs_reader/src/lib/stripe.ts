import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
    // To-do: Add the API version correctly
    apiVersion: '2020-08-27',
    typescript: true,
}); 