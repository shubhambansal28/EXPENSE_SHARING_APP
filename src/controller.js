import appServices from "./services.js";

const services = new appServices();

const createUser = async (body) =>
    await services.createUser(body);

const addMembers = async (body) =>
    await services.addMembers(body);

const payBill = async (body) =>
    await services.payBill(body);

const splitBill = async (body) =>
    await services.splitBill(body);

const balanceStatus = async (body) =>
    await services.balanceStatus(body);


export default {
    createUser,
    addMembers,
    payBill,
    splitBill,
    balanceStatus
};
