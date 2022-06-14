const {objectToObjectOfArrays} = require('./helper');
const getBodyFromUWSResponse = async function (res) {
    return new Promise(((resolve, reject) => {
        let buffer;
        res.onData((ab, isLast) => {
            let chunk = Buffer.from(ab);
            if (buffer) {
                buffer = Buffer.concat([buffer, chunk]);
            } else {
                buffer = Buffer.concat([chunk]);
            }
            if (isLast) {
                let json;
                try {
                    json = JSON.parse(buffer);
                } catch (e) {
                    console.error(e);
                    /* res.close calls onAborted */
                    try {
                        res.close();
                    } catch (e2) {
                        console.error(e2);
                    }
                    json = {};
                }
                resolve(json);
            }
        });
    }));
}
const extractFiltersFromRequest = async function (req, res) {
    let filters = {};
    if (process.env.uws === "true") {
        if (req.getQuery("userId")) {
            debug && console.log(`[WS]where userId=${req.getQuery("userId")}`);
            filters.userID = [req.getQuery("userId")];
        }

        let body = await getBodyFromUWSResponse(res);
        filters = {...filters, ...body};
    } else {
        if (req.query.userId) {
            debug && console.log(`[WS]where userId=${req.query.userId}`);
            filters.userID = [req.query.userId];
        }
        filters = {...filters, ...req.body};
    }
    filters = objectToObjectOfArrays({...filters, ...req.body});
    return Object.keys(filters).length > 0 ? filters : undefined;
}
module.exports = {
    extractFiltersFromRequest
};