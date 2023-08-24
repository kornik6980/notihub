"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";

import { CommentValidation } from "@/lib/validations/noti";
import Image from "next/image";
import { addCommentToNoti } from "@/lib/actions/noti.actions";

interface Props {
	notiId: string;
	currentUserImage: string;
	currentUserId: string;
}

const Comment = ({ notiId, currentUserImage, currentUserId }: Props) => {
	const pathname = usePathname();

	const form = useForm({
		resolver: zodResolver(CommentValidation),
		defaultValues: {
			noti: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
		await addCommentToNoti({
			notiId: notiId,
			commentText: values.noti,
			userId: JSON.parse(currentUserId),
			path: pathname,
		});

		form.reset();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
				<FormField
					control={form.control}
					name="noti"
					render={({ field }) => (
						<FormItem className="flex w-full items-center gap-3">
							<FormLabel>
								<Image
									src={currentUserImage}
									alt="profile img"
									width={48}
									height={48}
									className="rounded-full object-cover"
								/>
							</FormLabel>
							<FormControl className="border-none  bg-transparent">
								<Input
									type="text"
									placeholder="Comment..."
									className="no-focus text-light-1 outline-none"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<Button type="submit" className="comment-form_btn">
					Reply
				</Button>
			</form>
		</Form>
	);
};

export default Comment;
