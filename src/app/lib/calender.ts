import { tool } from "@langchain/core/tools";
import { z } from "zod";

type CalendarEvent = {
  id: string;
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  isRecurring: boolean;
  recurrence?: {
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
    daysOfWeek?: number[];
    endDate?: Date;
    count?: number;
  };
};

const calendarEvents: CalendarEvent[] = [];

const generateEventId = () =>
  `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const parseDate = (dateStr: string): Date => {
  const now = new Date();

  if (dateStr.toLowerCase() === "today") {
    return now;
  }

  if (dateStr.toLowerCase() === "tomorrow") {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return tomorrow;
  }

  return new Date(dateStr);
};

const parseTime = (timeStr: string, baseDate: Date): Date => {
  const date = new Date(baseDate);

  const simpleTimeRegex = /^(\d+)(am|pm)$/i;
  const simpleMatch = timeStr.match(simpleTimeRegex);

  if (simpleMatch) {
    const hours = parseInt(simpleMatch[1]);
    const isPM = simpleMatch[2].toLowerCase() === "pm";

    date.setHours(
      isPM && hours !== 12 ? hours + 12 : hours === 12 && !isPM ? 0 : hours
    );
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
  }

  const complexTimeRegex = /^(\d+):(\d+)(am|pm)$/i;
  const complexMatch = timeStr.match(complexTimeRegex);

  if (complexMatch) {
    const hours = parseInt(complexMatch[1]);
    const minutes = parseInt(complexMatch[2]);
    const isPM = complexMatch[3].toLowerCase() === "pm";

    date.setHours(
      isPM && hours !== 12 ? hours + 12 : hours === 12 && !isPM ? 0 : hours
    );
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
  }

  return new Date(`${baseDate.toDateString()} ${timeStr}`);
};

const dayNameToNumber = (dayName: string): number => {
  const days: Record<string, number> = {
    sunday: 0,
    sun: 0,
    monday: 1,
    mon: 1,
    tuesday: 2,
    tue: 2,
    wednesday: 3,
    wed: 3,
    thursday: 4,
    thu: 4,
    friday: 5,
    fri: 5,
    saturday: 6,
    sat: 6,
    first: 0,
    last: 6,
  };

  return days[dayName.toLowerCase()] ?? -1;
};

export const addCalendarEvent = tool(
  async ({
    title,
    date,
    time,
    duration,
    isRecurring,
    recurrenceFrequency,
    recurrenceInterval,
    recurrenceDaysOfWeek,
    recurrenceCount,
    recurrenceEndDate,
  }) => {
    const baseDate = parseDate(date);
    const startDateTime = parseTime(time, baseDate);

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + duration);

    const newEvent: CalendarEvent = {
      id: generateEventId(),
      title,
      startDateTime,
      endDateTime,
      isRecurring,
    };

    if (isRecurring && recurrenceFrequency) {
      newEvent.recurrence = {
        frequency: recurrenceFrequency,
        interval: recurrenceInterval || 1,
      };

      if (recurrenceDaysOfWeek && recurrenceDaysOfWeek.length > 0) {
        newEvent.recurrence.daysOfWeek = recurrenceDaysOfWeek;
      }

      if (recurrenceCount) {
        newEvent.recurrence.count = recurrenceCount;
      }

      if (recurrenceEndDate) {
        newEvent.recurrence.endDate = new Date(recurrenceEndDate);
      }
    }

    calendarEvents.push(newEvent);

    return {
      success: true,
      message: `Added ${isRecurring ? "recurring " : ""}event: ${title}`,
      eventId: newEvent.id,
    };
  },
  {
    description: "Add a new event to the calendar",
    schema: z.object({
      title: z
        .string()
        .min(1, { message: "Title is required" })
        .describe("The title or description of the event"),

      date: z
        .string()
        .min(1, { message: "Date is required" })
        .describe(
          "The date of the event (e.g., 'today', 'tomorrow', '2023-06-15')"
        ),

      time: z
        .string()
        .min(1, { message: "Time is required" })
        .describe("The time of the event (e.g., '10am', '3:30pm')"),

      duration: z
        .number()
        .int()
        .positive()
        .default(60)
        .describe("The duration of the event in minutes"),

      isRecurring: z
        .boolean()
        .default(false)
        .describe("Whether this is a recurring event"),

      recurrenceFrequency: z
        .enum(["daily", "weekly", "monthly", "yearly"])
        .optional()
        .describe("How often the event recurs"),

      recurrenceInterval: z
        .number()
        .int()
        .positive()
        .default(1)
        .describe("Interval for recurrence, e.g., every 2 weeks"),

      recurrenceDaysOfWeek: z
        .array(z.number().int().min(0).max(6))
        .optional()
        .describe("Days of week for recurrence (0 = Sunday, 6 = Saturday)"),

      recurrenceCount: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Number of occurrences"),

      recurrenceEndDate: z
        .string()
        .optional()
        .describe("End date for recurrence"),
    }),
    name: "addCalendarEvent",
  }
);

export const listCalendarEvents = tool(
  async () => {
    return {
      events: calendarEvents.map((event) => ({
        id: event.id,
        title: event.title,
        startDateTime: event.startDateTime.toISOString(),
        endDateTime: event.endDateTime.toISOString(),
        isRecurring: event.isRecurring,
        recurrence: event.recurrence,
      })),
    };
  },
  {
    description: "List all calendar events",
    schema: z.object({}),
    name: "listCalendarEvents",
  }
);

export const deleteCalendarEvent = tool(
  async ({ eventId }) => {
    const eventIndex = calendarEvents.findIndex(
      (event) => event.id === eventId
    );

    if (eventIndex !== -1) {
      calendarEvents.splice(eventIndex, 1);
      return {
        success: true,
        message: `Event with ID ${eventId} has been deleted`,
      };
    }

    return {
      success: false,
      message: `Event with ID ${eventId} not found`,
    };
  },
  {
    description: "Delete a calendar event by ID",
    schema: z.object({
      eventId: z.string().describe("The ID of the event to delete"),
    }),
    name: "deleteCalendarEvent",
  }
);

export const getTodayDate = tool(
  async () => {
    return {
      date: new Date().toISOString(),
    };
  },
  {
    description: "Get the current date",
    schema: z.object({}),
    name: "getTodayDate",
  }
);
