import { Loader2 } from "lucide-react";
import type { ZodTypeDef } from "zod";
import { z } from "zod";

import { Button } from "@acme/ui/button";
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

const MAX_DATE = "9999-12-31";
const MIN_DATE = "2009-01-03";

const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number",
  }),
  purchasePrice: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Price must be a positive number",
  }),
  purchaseDate: z.string().refine((val) => {
    const date = new Date(val);
    return date >= new Date(MIN_DATE) && date <= new Date(MAX_DATE);
  }, {
    message: `Date must be between ${MIN_DATE} and ${MAX_DATE}`,
  }),
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
      purchaseDate: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      amount: parseFloat(values.amount),
      purchasePrice: parseFloat(values.purchasePrice),
      purchaseDate: values.purchaseDate,
    });
  };

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
            <FormItem>
              <FormLabel>Purchase Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  min={MIN_DATE}
                  max={MAX_DATE}
                  {...field}
                  className="border-gray-600 bg-gray-700 text-white"
                />
              </FormControl>
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
