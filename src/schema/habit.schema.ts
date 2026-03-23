import z from "zod";
import { FREQUENCY_TYPES } from "../constants";

export const CheckInHabitSchema = z.object({
    habitId: z.string(),

    completed: z.boolean()
})


export const habitSchema = z.object({
    name: z.string().min(1, 'Habit name is required').max(24, 'Max 24 characters'),
    icon: z.string().min(1, 'Icon is required'),
    color: z.string(),
    category: z.string(),
    frequency: z.nativeEnum(FREQUENCY_TYPES),
    customDays: z.array(z.string()),
    targetCount: z.number().min(1),
    remindersEnabled: z.boolean(),
    reminderTime: z.date(),
    notes: z.string().optional(),
    meta: z.string().optional(),
    goalLabel: z.string().nullable().optional(),
    goalUnit: z.string().nullable().optional(),
});

export const updateHabitSchema = habitSchema.partial();