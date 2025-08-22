import { PaidTierNames } from "@/data/subscriptionTiers";
import { currentUser, User } from "@clerk/nextjs/server";
import { getUserSubscription } from "../db/subscription";
import { Stripe } from "stripe";
import {env as ServerEnv} from "@/data/env/server"

const stripe = new Stripe(ServerEnv.);

export async function createCheckoutSession(tier: PaidTierNames) {
  const user = await currentUser();
  if (user == null) return { error: true, message: "User does not exist" };

  const subscription = await getUserSubscription(user.id);

  if (subscription == null) return { error: true };

  if (subscription.stripeSubscriptionId == null) {
    const url = await getCheckoutSession(tier, user);
  } else {
  }
}

async function getCheckoutSession(tier: PaidTierNames, user: User) {
  const customerDetails = {
    customer_email: user.primaryEmailAddress?.emailAddress,
  };
}
