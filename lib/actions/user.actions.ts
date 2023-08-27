"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Noti from "../models/noti.model";

interface Params {
	userId: string;
	username: string;
	name: string;
	bio: string;
	image: string;
	path: string;
}

export async function updateUser({
	userId,
	username,
	name,
	bio,
	image,
	path,
}: Params): Promise<void> {
	try {
		connectToDB();

		await User.findOneAndUpdate(
			{ id: userId },
			{
				username: username.toLowerCase(),
				name,
				bio,
				image,
				onboarded: true,
			},
			{ upsert: true }
		);

		if (path === "/profile/edit") {
			revalidatePath(path);
		}
	} catch (err: any) {
		throw new Error(`Failed to create/update user: ${err.message}`);
	}
}

export async function fetchUser(userId: string) {
	try {
		connectToDB();

		return await User.findOne({
			id: userId,
		}); /* .populate({path: "communities", model: Community}) */
	} catch (err: any) {
		throw new Error(`Failed to fetch user: ${err.message}`);
	}
}

export async function fetchUserNotis(userId: string) {
	try {
		connectToDB();

		// TODO: populate community
		const notis = await User.findOne({ id: userId }).populate({
			path: "notis",
			model: Noti,
			populate: {
				path: "children",
				model: Noti,
				populate: { path: "author", model: User, select: "name image id" },
			},
		});

		return notis;
	} catch (err: any) {
		throw new Error(`Failed to fetch user notis: ${err.message}`);
	}
}
