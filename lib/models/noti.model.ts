import mongoose from "mongoose";

const notiSchema = new mongoose.Schema({
	text: { type: String, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	createdAt: { type: Date, default: Date.now },
	parentId: { type: String },
	children: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Noti",
		},
	],
});

const Noti = mongoose.models.Noti || mongoose.model("Noti", notiSchema);

export default Noti;
