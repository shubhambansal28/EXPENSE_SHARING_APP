export const config = {
    db: {
        agencydb: {
            url: "mongodb://localhost:27017/ExpenseApp",
            user: process.env.AGENCYDB_USER,
            pass: process.env.AGENCYDB_PASS
        }
    }
};
