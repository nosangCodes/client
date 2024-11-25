import * as z from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const menuItem = z.object({
    id: z.number(),
    name: requiredString,
    description: requiredString,
    column: requiredString,
    price: z.coerce.number().min(0, "Price must be a positive number").refine(value => value !== null || value !== "", "Price is required")
})
export const createMenuItem = z.object({
    name: requiredString,
    description: requiredString,
    column: requiredString,
    price: z.coerce.number().min(0, "Price must be a positive number").refine(value => value !== null || value !== "", "Price is required")
})

export type MenuItemValues = z.infer<typeof menuItem>

export const newMenuSchema = z.object({
    name: requiredString,
    items: z.array(menuItem)
})

export type NewMenuValues = z.infer<typeof newMenuSchema>