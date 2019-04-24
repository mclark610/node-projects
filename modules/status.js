
class Status {
    constructor(status, user, results) {
        return {
            "status":status,
            "user": user,
            "results": results
        };
    }
}

//let sts = new Status('success','Mark','whatever data required');

module.exports = Status;
