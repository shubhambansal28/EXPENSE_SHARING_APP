
const controllerHandler = (promise, params) => async (req, res, next) => {
    const boundParams = params ? params(req, res, next) : [];
    const logOptions = {
        user: res.req.headers.affiliateid,
        status: 200,
        method: res.req.method,
        noLogs: res.req.headers.noLogs,
        url: res.req.originalUrl,
        params: res.req.params,
        query: res.req.query,
        body: res.req.body
    };
    try {
        const result = await promise(...boundParams);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500) && next(error);
    }
};

export default controllerHandler;
