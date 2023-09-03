import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
	id: { type: String, required: true },
	username: { type: String, required: true },
	name: { type: String, required: true },
	image: String,
	bio: String,
	ceartedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	notis: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Noti",
		},
	],
	members: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
});

const Community =
	mongoose.models.Community || mongoose.model("Community", communitySchema);

export default Community;
