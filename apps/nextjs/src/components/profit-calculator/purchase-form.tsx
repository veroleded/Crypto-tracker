import { CalendarIcon, Loader2 } from "lucide-react";
import { useCallback } from "react";
import type { ZodTypeDef } from "zod";
import { z } from "zod";

import { Button } from "@acme/ui/button";
import { Calendar } from "@acme/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";
import { cn } from "@acme/ui/utils";

const MAX_DATE = new Date();
const MIN_DATE = new Date("2009-01-03");

const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number",
  }),
  purchasePrice: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Price must be a positive number",
  }),
  purchaseDate: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface PurchaseFormProps {
  onSubmit: (data: {
    amount: number;
    purchasePrice: number;
    purchaseDate: string;
  }) => void;
  isSubmitting: boolean;
}

export function PurchaseForm({ onSubmit, isSubmitting }: PurchaseFormProps) {
  const form = useForm<FormValues, ZodTypeDef, FormValues>({
    schema: formSchema,
    defaultValues: {
      amount: "",
      purchasePrice: "",
      purchaseDate: new Date().toISOString().split('T')[0],
    },
  });

  const handleSubmit = useCallback((values: FormValues) => {
    onSubmit({
      amount: parseFloat(values.amount),
      purchasePrice: parseFloat(values.purchasePrice),
      purchaseDate: values.purchaseDate,
    });
  }, [onSubmit]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6 space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount of Coins</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  {...field}
                  className="border-gray-600 bg-gray-700 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purchasePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase Price (USD)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  {...field}
                  className="border-gray-600 bg-gray-700 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purchaseDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Purchase Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full border-gray-600 bg-gray-700 pl-3 text-left font-normal text-white",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        new Date(field.value).toLocaleDateString()
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        field.onChange(`${year}-${month}-${day}`);
                      }
                    }}
                    disabled={(date) =>
                      date > MAX_DATE || date < MIN_DATE
                    }
                    initialFocus
                    classNames={{
                      day_selected: "bg-blue-600 hover:bg-blue-700 focus:bg-blue-600",
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full bg-blue-600 text-base text-white transition-all duration-300 hover:bg-blue-700"
          size="lg"
          variant="primary"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Purchase...
            </>
          ) : (
            "Add Purchase"
          )}
        </Button>
      </form>
    </Form>
  );
}
