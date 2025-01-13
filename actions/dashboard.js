"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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
export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const user = await db.user.findUnique({ where: { clerkUserId: userId } });

    if (!user) throw new Error("User not found");

    //Convert balance to float
    const balance = parseFloat(data.balance);
    if (isNaN(balance)) throw new Error("Invalid balance amount");

    const existingAccounts = await db.account.findMany({
      where: { userId: userId },
    });
    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    //   If account should be default, unset other default accounts
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const newAccount = await db.account.create({
      data: {
        ...data,
        balance: balance,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    const searializeAccountVar = searializeTransactions(newAccount);
    revalidatePath("/dashboard");
    return { success: true, account: searializeAccountVar };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getUserAccounts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });

  if (!user) throw new Error("User not found");

  const accounts = await db.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });
  const searializeAccountVar = accounts.map(searializeTransactions);

  return searializeAccountVar;
}
