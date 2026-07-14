import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";

const createPaymentSession = async (
  customerId: string,
  rentalOrderId: string,
) => {
  const rentalOrder = await prisma.rentalOrder.findUniqueOrThrow({
    where: { id: rentalOrderId },
    include: { gearItem: true },
  });

  if (rentalOrder.customerId !== customerId) {
    throw new Error("You are not allowed to pay for this rental order");
  }

  if (rentalOrder.status !== "CONFIRMED") {
    throw new Error("Only confirmed rental orders can be paid for");
  }

  const existingPayment = await prisma.payment.findFirst({
    where: { rentalOrderId, status: "COMPLETED" },
  });

  if (existingPayment) {
    throw new Error("This rental order has already been paid for");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: rentalOrder.gearItem.name,
            description: `Rental from ${rentalOrder.startDate.toDateString()} to ${rentalOrder.endDate.toDateString()}`,
          },
          unit_amount: Math.round(Number(rentalOrder.totalAmount) * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.CLIENT_SUCCESS_URL || "http://localhost:5000/api/payments/confirm"}?session_id={CHECKOUT_SESSION_ID}&rentalOrderId=${rentalOrderId}`,
    cancel_url: `${process.env.CLIENT_CANCEL_URL || "http://localhost:5000/api/payments/cancel"}`,
    metadata: {
      rentalOrderId,
      customerId,
    },
  });

  return { checkoutUrl: session.url, sessionId: session.id };
};

const confirmPayment = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed yet");
  }

  const rentalOrderId = session.metadata?.rentalOrderId as string;

  const payment = await prisma.$transaction(async (tx) => {
    const newPayment = await tx.payment.create({
      data: {
        transactionId: session.id,
        amount: (session.amount_total ?? 0) / 100,
        method: "STRIPE",
        status: "COMPLETED",
        paidAt: new Date(),
        rentalOrderId,
      },
    });

    await tx.rentalOrder.update({
      where: { id: rentalOrderId },
      data: { status: "PAID" },
    });

    return newPayment;
  });

  return payment;
};

const getCustomerPayments = async (customerId: string) => {
  return prisma.payment.findMany({
    where: { rentalOrder: { customerId } },
    include: { rentalOrder: { include: { gearItem: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const getPaymentById = async (id: string) => {
  return prisma.payment.findUniqueOrThrow({
    where: { id },
    include: {
      rentalOrder: {
        include: {
          gearItem: true,
          customer: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });
};

export const paymentService = {
  createPaymentSession,
  confirmPayment,
  getCustomerPayments,
  getPaymentById,
};
