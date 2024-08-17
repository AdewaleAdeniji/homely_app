/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Dashboard from "./page";
import { BatteryProp } from "./types";
import chargingService from "../../services/ChargingService";
import { analyzeLightData, calculateLightStats, Charge, convertMinutesToHours, convertToMinutes, convertToSeconds } from "../../utils/chargeParser";
import { differenceInMilliseconds } from "date-fns";

const DashboardPage = () => {
    const [currentChargeStatus, setCurrentChargeStatus] = useState<boolean>(false);
    const [totalWeekLightHours, setTotalWeeklyLightHours] = useState<any>()
  // const [allCharges, setCharges] = useState<any>([]);
  let proceedToRecordCharge = true;
  const initBattery = async () => {
    alert('here')
    (navigator as any).getBattery().then((battery: any) => {
      alert('battery is '+battery.charging)
      handleBatteryChange(battery);
      battery.addEventListener("chargingchange", () => {
        handleBatteryChange(battery);
      });
    });
  };
  const handleBatteryChange = async (battery: BatteryProp) => {
    navigator.vibrate(500);
    alert('battery is '+battery.charging)
    setCurrentChargeStatus(battery.charging);
    if(proceedToRecordCharge){
      proceedToRecordCharge = false;
      await chargingService.addChargingStatus(battery.charging);
      calculateLightStat()
      setTimeout(() => {
        proceedToRecordCharge = true;
      }, 1000)
    }
  };
  useEffect(() => {
    initBattery();
  },[])
  const calculateLightStat = async () => {
    const charges: Charge[] = await chargingService.allCharges() as Charge[];
    const chargesOrderBasedOnNumberKey = charges.sort((a: any, b: any) => a.number - b.number);

    let lightTime = 0;
    let totalTime = 0;

    const chargeMaps = chargesOrderBasedOnNumberKey.map((charge: Charge, index: number) => {
      if(index === 0){
        return {
          ...charge,
        }
      }
      const lastCharge = chargesOrderBasedOnNumberKey[index - 1];
      const lastChargeISO = lastCharge.time;
      const currentChargeISO = charge.time;

      const difference = differenceInMilliseconds(new Date(currentChargeISO), new Date(lastChargeISO));  
      totalTime += difference;
      if(charge.charging && lastCharge.charging){
        lightTime += difference;
      }
      return {
        ...charge,
        millisecondsDiff: difference,
        minutesDiff: convertToMinutes(difference),
        secondsDiff: convertToSeconds(difference)
      }
    })
    console.log(chargeMaps)
    // console.log(chargeMaps[0].time, lightTime, chargeMaps[chargeMaps.length - 1].time, totalTime, totalTime - lightTime)
    const stats = calculateLightStats(chargeMaps);
    const analysis = analyzeLightData(stats.filteredData)
    console.log(analysis)
    setTotalWeeklyLightHours(convertMinutesToHours(convertToMinutes(analysis.totalLightMilliseconds)||0).toFixed(2));

  }
  
  return (
    <>
      <Dashboard charges={[]} totalWeekLightHours={totalWeekLightHours}/>
    </>
  );
};
export default DashboardPage;
