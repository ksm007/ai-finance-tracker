"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { date } from "zod";

const searializeTransactions = (account) => {
  const searializeAccount = { ...account };
  if (searializeAccount.balance) {
    searializeAccount.balance = searializeAccount.balance.toNumber();
  }
  if (searializeAccount.amount) {
    searializeAccount.amount = searializeAccount.amount.toNumber();
  }
  return searializeAccount;
};

export async function updateDefaultAccount(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const user = await db.user.findUnique({ where: { clerkUserId: userId } });

    if (!user) throw new Error("User not found");

    await db.account.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });

    const updatedAccount = await db.account.update({
      where: { id: accountId },
      data: { isDefault: true },
    });

    revalidatePath("/dashboard");
    return { success: true, account: searializeTransactions(updatedAccount) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getAccountWithTransactions(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const user = await db.user.findUnique({ where: { clerkUserId: userId } });

    if (!user) throw new Error("User not found");

    const account = await db.account.findUnique({
      where: { id: accountId, userId: user.id },
      include: {
        transactions: {
          orderBy: { date: "desc" },
        },
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    if (!account) return null;
    return {
      ...searializeTransactions(account),
      transactions: account.transactions.map(searializeTransactions),
    };
  } catch (error) {
    console.log(error.message);
  }
}

export async function bulkDeleteTransactions(transactionIds) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const user = await db.user.findUnique({ where: { clerkUserId: userId } });

    if (!user) throw new Error("User not found");

    const transactions = await db.transaction.findMany({
      where: {
        id: {
          in: transactionIds,
        },
        userId: user.id,
      },
    });
    console.log(transactions);

    const accountBalanceChanges = transactions.reduce((acc, transaction) => {
      const change =
        transaction.type === "EXPENSE"
          ? transaction.amount.toNumber()
          : -transaction.amount.toNumber();

      if (!acc[transaction.accountId]) {
        acc[transaction.accountId] = 0;
      }
      acc[transaction.accountId] += change;
      return acc;
    }, {});
    // delete transactions and update account balances
    await db.$transaction(async (tx) => {
      await tx.transaction.deleteMany({
        where: {
          id: {
            in: transactionIds,
          },
          userId: user.id,
        },
      });
      await Promise.all(
        Object.entries(accountBalanceChanges).map(
          ([accountId, balanceChange]) =>
            tx.account.update({
              where: { id: accountId },
              data: {
                balance: {
                  increment: balanceChange,
                },
              },
            })
        )
      );
    });
    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
