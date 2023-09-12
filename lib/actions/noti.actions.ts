"use server";

import { revalidatePath } from "next/cache";
import Noti from "../models/noti.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
	text: string;
	author: string;
	path: string;
}

export async function createNoti({ text, author, path }: Params) {
	try {
		connectToDB();

		const createdNoti = await Noti.create({
			text,
			author,
		});

		await User.findByIdAndUpdate(author, {
			$push: { notis: createdNoti._id },
		});

		revalidatePath(path);
	} catch (err: any) {
		throw new Error(`Error creating noti: ${err.message}`);
	}
}

export async function fetchNotis(pageNumber = 1, pageSize = 20) {
	try {
		connectToDB();

		const skipAmount = (pageNumber - 1) * pageSize;

		const notisQuery = Noti.find({ parentId: { $in: [null, undefined] } })
			.sort({ createdAt: "desc" })
			.skip(skipAmount)
			.limit(pageSize)
			.populate({ path: "author", model: "User" })
			.populate({
				path: "children",
				populate: {
					path: "author",
					model: "User",
					select: "_id name parentId image",
				},
			});

		const totalPostCount = await Noti.countDocuments({
			parentId: { $in: [null, undefined] },
		});

		const notis = await notisQuery.exec();

		const isNext = totalPostCount > skipAmount + notis.length;

		return { notis, isNext };
	} catch (err: any) {
		throw new Error(`Error fetching notis: ${err.message}`);
	}
}

export async function fetchNotiById(id: string) {
	try {
		connectToDB();
		const noti = await Noti.findById(id)
			.populate({ path: "author", model: "User", select: "_id id name image" })
			.populate({
				path: "children",
				populate: [
					{
						path: "author",
						model: User,
						select: "_id id name parentId image",
					},
					{
						path: "children",
						model: Noti,
						populate: {
							path: "author",
							model: User,
							select: "_id id name parentId image",
						},
					},
				],
			})
			.exec();

		return noti;
	} catch (err: any) {
		throw new Error(`Error fetching noti: ${err.message}`);
	}
}

export async function addCommentToNoti({
	notiId,
	commentText,
	userId,
	path,
}: {
	notiId: string;
	commentText: string;
	userId: string;
	path: string;
}) {
	try {
		connectToDB();

		const originalNoti = await Noti.findById(notiId);

		if (!originalNoti) {
			throw new Error("Noti not found");
		}

		const commentNoti = new Noti({
			text: commentText,
			author: userId,
			parentId: notiId,
		});

		const savedCommentNoti = await commentNoti.save();

		originalNoti.children.push(savedCommentNoti._id);

		await originalNoti.save();

		revalidatePath(path);
	} catch (err: any) {
		throw new Error(`Error adding comment to noti: ${err.message}`);
	}
}

export async function handleLike({
	notiId,
	userId,
	path,
}: {
	notiId: string;
	userId: string;
	path: string;
}) {
	try {
		connectToDB();

		const noti = await Noti.findById(notiId);
		if (!noti) {
			throw new Error("Noti not found");
		}

		if (noti.likes.includes(userId)) {
			noti.likes = noti.likes.filter(
				(likeId: any) => likeId.toString() !== userId
			);
		} else {
			noti.likes.push(userId);
		}

		await noti.save();

		revalidatePath(path);
	} catch (err: any) {
		throw new Error(`Error toggling like on noti: ${err.message}`);
	}
}
