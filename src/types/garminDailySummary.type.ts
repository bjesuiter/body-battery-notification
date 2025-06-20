import { z } from "zod/v4";

export const GarminDailySummaryRawSchema = z.record(z.string(), z.unknown());
export type GarminDailySummaryRaw = z.infer<typeof GarminDailySummaryRawSchema>;

export const GarminDailySummarySchema = z.object({
  userProfileId: z.number(),
  //   totalKilocalories: z.number().nullable(),
  //   activeKilocalories: z.number().nullable(),
  //   bmrKilocalories: z.number().nullable(),
  //   wellnessKilocalories: z.number().nullable(),
  //   burnedKilocalories: z.number().nullable(),
  //   consumedKilocalories: z.number().nullable(),
  //   remainingKilocalories: z.number().nullable(),
  //   totalSteps: z.number().nullable(),
  //   netCalorieGoal: z.number().nullable(),
  //   totalDistanceMeters: z.number().nullable(),
  //   wellnessDistanceMeters: z.number().nullable(),
  //   wellnessActiveKilocalories: z.number().nullable(),
  //   netRemainingKilocalories: z.number().nullable(),
  //   userDailySummaryId: z.number(),
  calendarDate: z.iso.date(),
  //   rule: z.object({ typeId: z.number(), typeKey: z.string() }),
  uuid: z.string(),
  //   dailyStepGoal: z.number(),
  //   wellnessStartTimeGmt: z.string(),
  //   wellnessStartTimeLocal: z.string(),
  //   wellnessEndTimeGmt: z.string(),
  //   wellnessEndTimeLocal: z.string(),
  //   durationInMilliseconds: z.number(),
  //   wellnessDescription: z.number().nullable(),
  //   highlyActiveSeconds: z.number().nullable(),
  //   activeSeconds: z.number().nullable(),
  //   sedentarySeconds: z.number().nullable(),
  //   sleepingSeconds: z.number().nullable(),
  //   includesWellnessData: z.boolean().nullable(),
  //   includesActivityData: z.boolean().nullable(),
  //   includesCalorieConsumedData: z.boolean().nullable(),
  //   privacyProtected: z.boolean().nullable(),
  //   moderateIntensityMinutes: z.number(),
  //   vigorousIntensityMinutes: z.number(),
  //   floorsAscendedInMeters: z.null(),
  //   floorsDescendedInMeters: z.null(),
  //   floorsAscended: z.null(),
  //   floorsDescended: z.null(),
  //   intensityMinutesGoal: z.number(),
  //   userFloorsAscendedGoal: z.number(),
  //   minHeartRate: z.number(),
  //   maxHeartRate: z.number(),
  //   restingHeartRate: z.number(),
  //   lastSevenDaysAvgRestingHeartRate: z.number(),
  // source: "GARMIN"
  source: z.string(),
  //   averageStressLevel: z.number().nullable(),
  //   maxStressLevel: z.number().nullable(),
  //   stressDuration: z.number().nullable(),
  //   restStressDuration: z.number().nullable(),
  //   activityStressDuration: z.number().nullable(),
  //   uncategorizedStressDuration: z.number().nullable(),
  //   totalStressDuration: z.number().nullable(),
  //   lowStressDuration: z.number().nullable(),
  //   mediumStressDuration: z.number().nullable(),
  //   highStressDuration: z.number().nullable(),
  //   stressPercentage: z.number().nullable(),
  //   restStressPercentage: z.number().nullable(),
  //   activityStressPercentage: z.number().nullable(),
  //   uncategorizedStressPercentage: z.number().nullable(),
  //   lowStressPercentage: z.number().nullable(),
  //   mediumStressPercentage: z.number().nullable(),
  //   highStressPercentage: z.number().nullable(),
  //   stressQualifier: z.string().nullable(),
  //   measurableAwakeDuration: z.number().nullable(),
  //   measurableAsleepDuration: z.number().nullable(),
  lastSyncTimestampGMT: z.iso.datetime(),
  //   minAvgHeartRate: z.number().nullable(),
  //   maxAvgHeartRate: z.number().nullable(),
  bodyBatteryChargedValue: z.number().nullable(),
  bodyBatteryDrainedValue: z.number().nullable(),
  bodyBatteryHighestValue: z.number().nullable(),
  bodyBatteryLowestValue: z.number().nullable(),
  bodyBatteryMostRecentValue: z.number().nullable(),
  bodyBatteryDuringSleep: z.number().nullable(),
  bodyBatteryAtWakeTime: z.number().nullable(),
  bodyBatteryVersion: z.number().nullable(),
  //   abnormalHeartRateAlertsCount: z.number().nullable(),
  //   averageSpo2: z.number().nullable(),
  //   lowestSpo2: z.number().nullable(),
  //   latestSpo2: z.number().nullable(),
  //   latestSpo2ReadingTimeGmt: z.string().nullable(),
  //   latestSpo2ReadingTimeLocal: z.null(),
  //   averageMonitoringEnvironmentAltitude: z.null(),
  //   restingCaloriesFromActivity: z.null(),
  //   avgWakingRespirationValue: z.number(),
  //   highestRespirationValue: z.number(),
  //   lowestRespirationValue: z.number(),
  //   latestRespirationValue: z.number(),
  //   latestRespirationTimeGMT: z.string(),
  //   respirationAlgorithmVersion: z.number()
});

export type GarminDailySummary = z.infer<typeof GarminDailySummarySchema>;
