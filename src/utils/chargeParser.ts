/* eslint-disable no-var */
import {
  addDays,
  differenceInCalendarWeeks,
  differenceInHours,
  differenceInMilliseconds,
  getDay,
  getHours,
  isSameWeek,
  parseISO,
  startOfWeek,
} from "date-fns";

export interface Charge {
  id: string;
  charging: boolean;
  time: string;
}

interface ChargesByWeek {
  week: string;
  data: Charge[];
}

interface ChargesByDay {
  day: string;
  data: Charge[];
}

interface LightStats {
  totalLightHours: number;
  totalNoLightHours: number;
  filteredData: {
    charging: boolean;
    startTime: string;
    endTime: string;
    hours: number;
  }[];
}

interface DayData {
  day: string;
  lightOn: number;
  lightOff: number;
}

interface WeeklyLightData {
  totalLightOn: number;
  totalLightOff: number;
  dayData: DayData[];
}
export function convertToSeconds(milliseconds: number){
  return milliseconds / 1000;
}
export function convertToMinutes(milliseconds: number){
  return milliseconds / 60000;
}
export const convertHoursToMinutes = (hours: number) => {
  return hours * 60;
}
export const convertMinutesToHours = (minutes: number) => {
  return minutes / 60;
}
export const convertHoursToSeconds = (hours: number) => {
  return hours * 3600;
}
export const convertMinutesToSeconds = (minutes: number) => {
  return minutes * 60;
}
export function segregateByWeeks(charges: Charge[]): ChargesByWeek[] {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const segregated: { [key: string]: Charge[] } = {};

  charges.forEach((charge) => {
    const chargeDate = parseISO(charge.time);
    const weekNumber =
      differenceInCalendarWeeks(chargeDate, currentWeekStart) + 1;
    const weekKey = weekNumber === 1 ? "current" : String(weekNumber);

    if (!segregated[weekKey]) {
      segregated[weekKey] = [];
    }
    segregated[weekKey].push(charge);
  });

  return Object.entries(segregated).map(([week, data]) => ({ week, data }));
}

export function segregateByDays(charges: Charge[]): ChargesByDay[] {
  const currentDate = new Date();
  const currentWeekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const currentDayIndex = getDay(currentDate);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const segregated: ChargesByDay[] = daysOfWeek.map((day, index) => ({
    day: currentDayIndex === index ? "today" : day,
    data: [],
  }));

  charges.forEach((charge) => {
    const chargeDate = parseISO(charge.time);
    if (isSameWeek(chargeDate, currentWeekStart)) {
      const dayIndex = getDay(chargeDate);
      segregated[dayIndex].data.push(charge);
    }
  });

  return segregated;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function calculateLightStats(charges: Charge[]): any {
  if (charges.length === 0)
    return { totalLightHours: 0, totalNoLightHours: 0, filteredData: [] };

  const filteredData: {
    charging: boolean;
    startTime: string;
    endTime: string;
    hours: number;
  }[] = [];
  let totalLightHours = 0;
  let totalNoLightHours = 0;

  let current = charges[0];
  let startTime = parseISO(current.time);

  for (let i = 1; i < charges.length; i++) {
    const next = charges[i];
    if (current.charging !== next.charging) {
      const endTime = parseISO(next.time);
      const hours =
        (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

      if (current.charging) {
        totalLightHours += hours;
      } else {
        totalNoLightHours += hours;
      }

      filteredData.push({
        charging: current.charging,
        startTime: current.time,
        endTime: next.time,
        hours,
      });

      current = next;
      startTime = endTime;
    }
  }

  // Handle the last segment
  const endTime = new Date();
  const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  if (current.charging) {
    totalLightHours += hours;
  } else {
    totalNoLightHours += hours;
  }
  filteredData.push({
    charging: current.charging,
    startTime: current.time,
    endTime: endTime.toISOString(),
    hours,
  });

  return { 
    totalLightHours, 
    totalNoLightHours, 
    filteredData,
    totalLightHoursInMinutes: convertHoursToMinutes(totalLightHours),
    totalNoLightHoursInMinutes: convertHoursToMinutes(totalNoLightHours),
    totalLightHoursInSeconds: convertHoursToSeconds(totalLightHours),
    totalNoLightHoursInSeconds: convertHoursToSeconds(totalNoLightHours),
   };
}
export const calculateWeeklyLightData = (currentWeekData: ChargesByDay[]) => {
    console.log(currentWeekData);

    var weekLightOnHours = 0;
    var weekLightOffHours = 0;

    const dayData = {};

};
export function calculateWeeklyLightDataOld(
  currentWeekData: ChargesByDay[]
): WeeklyLightData {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var totalLightOn = 0;
  var totalLightOff = 0;
  const dayData: DayData[] = daysOfWeek.map((day) => ({
    day,
    lightOn: 0,
    lightOff: 0,
  }));

  currentWeekData.forEach((day) => {
    day.data.forEach((charge, index, array) => {
      const currentChargeTime = parseISO(charge.time);
      const nextCharge = array[index + 1];
      const nextChargeTime = nextCharge
        ? parseISO(nextCharge.time)
        : new Date();

      const hoursDifference = differenceInHours(
        nextChargeTime,
        currentChargeTime
      );

      const dayIndex = daysOfWeek.indexOf(day.day);
      if (charge.charging) {
        totalLightOn += hoursDifference;
        dayData[dayIndex].lightOn += hoursDifference;
      } else {
        totalLightOff += hoursDifference;
        dayData[dayIndex].lightOff += hoursDifference;
      }
    });
  });

  return {
    totalLightOn,
    totalLightOff,
    dayData,
  };
}




interface ChargeSegment {
  charging: boolean;
  startTime: string;
  endTime: string;
  hours: number;
}

interface LightAnalysis {
  totalLightMilliseconds: number;
  totalMilliseconds: number;
  totalNoLightMilliseconds: number;
  peakLightHours: Record<number, number>;  // { hourOfDay: totalLightTimeInMillis }
  peakNoLightHours: Record<number, number>; // { hourOfDay: totalNoLightTimeInMillis }
  weeklyLightHours: number;
  averageLightPerDay: number;
  averageLightPerWeek: number;
  averageLightPerMonth: number;
}

export function analyzeLightData(chargingData: ChargeSegment[]): LightAnalysis {
  let totalLightMilliseconds = 0;
  let totalMilliseconds = 0;
  let totalNoLightMilliseconds = 0;

  const peakLightHours: Record<number, number> = {};
  const peakNoLightHours: Record<number, number> = {};

  // Initialize peak hour analysis
  for (let hour = 0; hour < 24; hour++) {
    peakLightHours[hour] = 0;
    peakNoLightHours[hour] = 0;
  }

  chargingData.forEach((segment) => {
    const start = parseISO(segment.startTime);
    const end = parseISO(segment.endTime);
    const segmentDurationMilliseconds = differenceInMilliseconds(end, start);

    // Update total light/no-light time
    totalMilliseconds += segmentDurationMilliseconds;

    if (segment.charging) {
      totalLightMilliseconds += segmentDurationMilliseconds;
    } else {
      totalNoLightMilliseconds += segmentDurationMilliseconds;
    }

    // Analyze light/no-light based on hour of the day
    let current = start;
    while (current < end) {
      const hourOfDay = getHours(current);
      const nextHour = addDays(current, 1);
      const endOfCurrentHour = nextHour < end ? nextHour : end;

      const currentHourDuration = differenceInMilliseconds(endOfCurrentHour, current);
      if (segment.charging) {
        peakLightHours[hourOfDay] += currentHourDuration;
      } else {
        peakNoLightHours[hourOfDay] += currentHourDuration;
      }

      current = endOfCurrentHour;
    }
  });

  // Calculate weekly, daily, monthly averages
  const totalDays = totalMilliseconds / (1000 * 60 * 60 * 24); // Convert to days
  const totalWeeks = totalDays / 7;
  const totalMonths = totalDays / 30;

  const weeklyLightHours = totalLightMilliseconds / (1000 * 60 * 60); // Convert to hours
  const averageLightPerDay = weeklyLightHours / totalDays;
  const averageLightPerWeek = weeklyLightHours / totalWeeks;
  const averageLightPerMonth = weeklyLightHours / totalMonths;

  return {
    totalLightMilliseconds,
    totalMilliseconds,
    totalNoLightMilliseconds,
    peakLightHours,
    peakNoLightHours,
    weeklyLightHours,
    averageLightPerDay,
    averageLightPerWeek,
    averageLightPerMonth,
  };
}
