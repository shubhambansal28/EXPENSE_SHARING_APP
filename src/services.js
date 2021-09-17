import {
    UserModel,
    MemberModel,
    TransactionModel
} from "./models/index.js";

import pkg from 'mongoose';
const { Types } = pkg;
//import { Types } from "mongoose";


export default class ExpenseApp {
    async createUser(body) {
        const userExist = await UserModel.findOne({ contact: body.contact }).lean();
        if (!userExist) {
            const result = await new UserModel({ userName: body.userName, contact: body.contact, gender: body.gender, age: body.age }).save();
            await new MemberModel({ parentID: result._id }).save();
            return result;
        }
        else {
            return {
                message: "user already exist",
                status: false
            };
        }
    }
    async addMembers(body) {
        let balances = [];
        const userExist = await MemberModel.findOne({ parentID: Types.ObjectId(body.parentID) }).lean();
        if (userExist) {
            const membercheckInUsers = await UserModel.findOne({ contact: body.user.contact }).lean();
            if (!membercheckInUsers)
                await new UserModel({ userName: body.user.userName, contact: body.user.contact, gender: body.user.gender, age: body.user.age }).save();
            const UserData = await UserModel.findOne({ contact: body.user.contact }).lean();
            if (userExist.balances && userExist.balances.length > 0) {
                balances = userExist.balances;
                if (userExist.balances.filter(val => val.childId == UserData._id).length == 0) {
                    userExist.balances.forEach(element => {
                        if (balances.filter(val => (val.childId == element.childId && val.refId == UserData._id) || (val.childId == UserData._id && val.refId == element.childId)).length == 0)
                            balances.push({ childId: element.childId, refId: UserData._id, amount: 0 }, { childId: UserData._id, refId: element.childId, amount: 0 })
                    });
                }
                else {
                    return {
                        message: "Member Already Exists",
                        status: false
                    };
                }
            } else {
                balances.push({ childId: body.parentID, refId: UserData._id, amount: 0 }, { childId: UserData._id, refId: body.parentID, amount: 0 })
            }
            await MemberModel.updateOne(
                {
                    parentID: body.parentID,
                },
                {
                    $set: { balances: balances },
                }
            );
            return await MemberModel.findOne({ parentID: Types.ObjectId(body.parentID) }).lean();
        }
        else {
            return {
                message: "user not exist",
                status: false
            };
        }
    }
    async payBill(body) {
        const userExist = await UserModel.findOne({ _id: Types.ObjectId(body.id) }).lean();
        if (userExist) {
            const result = await new TransactionModel({ refUserId: Types.ObjectId(body.id), billAmount: body.billAmount, remarks: body.remarks.substring(0, 50) }).save();
            return result;
        }
        else {
            return {
                message: "user not exist",
                status: false
            };
        }
    }
    async splitBill(body) {
        const transactionDetails = await TransactionModel.findOne({ _id: Types.ObjectId(body.transactionId), refUserId: (body.userId) });
        if (transactionDetails) {
            const splittedAmount = (transactionDetails.billAmount / (body.splitBillUsersRefIds.length + 1));
            let memberDetails = await MemberModel.findOne({ parentID: Types.ObjectId(body.userId) }).lean();
            if (memberDetails && memberDetails.balances && memberDetails.balances.length > 0) {
                let balances = memberDetails.balances;
                balances.forEach(element => {
                    let filterUserChildId = body.splitBillUsersRefIds.filter(val => val == element.childId && element.refId == body.userId);
                    if (filterUserChildId && filterUserChildId.length > 0) {
                        element.amount = element.amount - splittedAmount;
                    }
                    let filterbyUserId = body.splitBillUsersRefIds.filter(val => val == element.refId && element.childId == body.userId);
                    if (filterbyUserId && filterbyUserId.length > 0) {
                        element.amount = element.amount + splittedAmount;
                    }
                });
                //return balances;
                await MemberModel.updateOne(
                    {
                        parentID: body.userId,
                    },
                    {
                        $set: { balances: balances },
                    }
                );
                return {
                    message: "Success",
                    status: true
                }
            }
        }
        else {
            return {
                message: "Transaction Not Found",
                status: false
            };
        }
    }
    async balanceStatus(body) {
        let resp = [];
        const memberDetails = await MemberModel.findOne({ parentID: Types.ObjectId(body.parentID) }).lean();
        if (memberDetails) {

            let filteredValues = memberDetails.balances.filter(val => val.childId == body.userId);
            if (filteredValues && filteredValues.length > 0) {

                for (let index = 0; index < filteredValues.length; index++) {
                    let UserDetails = await UserModel.findOne({ _id: Types.ObjectId(filteredValues[index].refId) }).lean();
                    if (filteredValues[index].amount > 0)
                        resp.push({ ...filteredValues[index], message: UserDetails.userName + " have to give you " + filteredValues[index].amount });
                    else if (filteredValues[index].amount < 0)
                        resp.push({ ...filteredValues[index], message: "You have to give " + -filteredValues[index].amount + " to " + UserDetails.userName });
                    else
                        resp.push({ ...filteredValues[index], message: "No Pending Dues with " + UserDetails.userName });
                }
            }
            return resp;
        }
        else {
            return {
                message: "Member Not Found",
                status: false
            };
        }
    }



}