import indexDBService, { dbStores } from '../utils/indexedDB';

const addChargingStatus = async (charging: boolean) => {
    const savedCharges = await allCharges();
    const chargePayload = {
        id: Math.random().toString(36).substr(2, 9),
        charging,
        time: new Date().toISOString(),
        number: savedCharges.length + 1,
    };
    await indexDBService.saveItem(chargePayload, dbStores.charges);
}
const allCharges = async () => {
    const savedCharges = indexDBService.getAllItems(dbStores.charges) || [];
    return savedCharges;
}
const chargingService = {
    addChargingStatus,
    allCharges,
};
export default chargingService;