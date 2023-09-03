"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Noti from "../models/noti.model";
import { FilterQuery, SortOrder } from "mongoose";

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

export async function fetchUsers({
	userId,
	searchString = "",
	pageNumber = 1,
	pageSize = 20,
	sortBy = "desc",
}: {
	userId: string;
	searchString?: string;
	pageNumber?: number;
	pageSize?: number;
	sortBy?: SortOrder;
}) {
	try {
		connectToDB();

		const skipAmount = (pageNumber - 1) * pageSize;

		const regex = new RegExp(searchString, "i");

		const query: FilterQuery<typeof User> = {
			id: { $ne: userId },
		};

		if (searchString.trim() !== "") {
			query.$or = [
				{ username: { $regex: regex } },
				{ name: { $regex: regex } },
			];
		}

		const sortOptions = { createdAt: sortBy };

		const usersQuery = User.find(query)
			.sort(sortOptions)
			.skip(skipAmount)
			.limit(pageSize);

		const totalUsersCount = await User.countDocuments(query);

		const users = await usersQuery.exec();

		const isNext = totalUsersCount > skipAmount + users.length;

		return { users, isNext };
	} catch (err: any) {
		throw new Error(`Failed to fetch users: ${err.message}`);
	}
}

export async function getActivity(userId: string) {
	try {
		connectToDB();

		const userNotis = await Noti.find({ author: userId });

		const childNotiIds = userNotis.reduce((acc, userNoti) => {
			return acc.concat(userNoti.children);
		}, []);

		const replies = await Noti.find({
			_id: { $in: childNotiIds },
			author: { $ne: userId },
		}).populate({
			path: "author",
			model: User,
			select: "name image _id",
		});

		return replies;
	} catch (err: any) {
		throw new Error(`Failed to fetch activity: ${err.message}`);
	}
}
