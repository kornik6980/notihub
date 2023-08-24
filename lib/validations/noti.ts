import * as z from "zod";

export const NotiValidation = z.object({
	noti: z
		.string()
		.nonempty({ message: "Type something first" })
		.min(3, { message: "Minimum 3 characters" }),
	accountId: z.string(),
});

export const CommentValidation = z.object({
	noti: z.string().nonempty().min(3, { message: "Minimum 3 characters" }),
});
