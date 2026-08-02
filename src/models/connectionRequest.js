const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    },
   
},

{timestamps: true}
);
// This is compund index for fast db querying and to ensure that there is only one connection request between two users at any given time.
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });


connectionRequestSchema.pre("save",  function (next) {
    const connectionRequest = this;
// Check if the fromUserId and toUserId are the same

if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send a connection request to yourself");
}
next();
});

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;