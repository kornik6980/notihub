import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	id: { type: String, required: true },
	username: { type: String, required: true },
	name: { type: String, required: true },
	image: String,
	bio: String,
	notis: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Noti",
		},
	],
	onboarded: {
		type: Boolean,
		default: false,
	},
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
