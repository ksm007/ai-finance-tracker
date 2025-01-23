"use client";
import { createTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useFetch } from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { get, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ReceiptScanner from "./receipt-scanner";

const AddTransactionForm = ({ accounts, categories }) => {
  const router = useRouter();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: "",
      description: "",
      date: new Date(),
      accountId: accounts.find((account) => account.isDefault).id,
      isRecurring: false,
    },
  });
  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: trasactionResult,
  } = useFetch(createTransaction);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    transactionFn(formData);
  };

  useEffect(() => {
    if (trasactionResult?.success && !transactionLoading) {
      toast.success("Transaction created successfully");
      reset();
      router.push(`/account/${trasactionResult.data.accountId}`);
    }
  }, [trasactionResult, transactionLoading]);

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
      toast.success("Receipt scanned successfully");
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {/* AI Receipt Scanner */}
      <ReceiptScanner onScanComplete={handleScanComplete} />
      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select
          onValueChange={(value) => setValue("type", value)}
          defaultValue={type}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-red-500 text-sm">{errors.type.message}</p>
        )}
      </div>
      {/* Amount */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="number"
            {...register("amount")}
            placeholder="Amount"
            step="0.01"
          ></Input>
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Account ID</label>
          <Select
            onValueChange={(value) => setValue("accountId", value)}
            defaultValue={getValues("accountId")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} (${parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <span className=" w-full items-center text-sm px-2">
                  Create Account
                </span>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && (
            <p className="text-red-500 text-sm">{errors.accountId.message}</p>
          )}
        </div>
      </div>

      {/* category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          defaultValue={getValues("category")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </div>
      {/* Date */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full pl-3 text-left font-normal"
            >
              {date ? format(date, "PPP") : <span>Select Date</span>}
              <CalendarIcon className="w-5 h-5 ml-auto"></CalendarIcon>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelectedChange={(date) => setValue("date", date)}
              disabled={(date) =>
                date > new Date() || date < new Date(1900, 1, 1)
              }
            >
              initialFocus
            </Calendar>
          </PopoverContent>
        </Popover>

        {errors.date && (
          <p className="text-red-500 text-sm">{errors.date.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input placeholder="Enter description" {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Recurring */}
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <label className="text-sm font-medium cursor-pointer">
            Set as Recurring
          </label>
          <p>Setup recurring schedule for transactions</p>
        </div>
        <Switch
          id="isDefault"
          onCheckedChange={(checked) => setValue("isRecurring", checked)}
          checked={isRecurring}
        />
        {errors.isDefault && (
          <span className=" text-sm text-red-500">
            {errors.isDefault.message}
          </span>
        )}
      </div>
      {/* Recurirng duration */}
      {isRecurring && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Recurirng Interval</label>
          <Select
            onValueChange={(value) => setValue("recurringInterval", value)}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select recurring interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (
            <p className="text-red-500 text-sm">
              {errors.recurringInterval.message}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" className="w-full" disabled={transactionLoading}>
          Create Transaction
        </Button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
