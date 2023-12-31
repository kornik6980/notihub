import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import LikeButton from "../shared/LikeButton";

interface Props {
	id: string;
	currentUser: string;
	parentId: string | null;
	content: string;
	author: {
		id: string;
		name: string;
		image: string;
	};
	createdAt: string;
	comments: {
		author: {
			image: string;
		};
	}[];
	likes: [];
	isComment?: boolean;
}

const NotiCard = ({
	id,
	currentUser,
	parentId,
	content,
	author,
	createdAt,
	comments,
	likes,
	isComment,
}: Props) => {
	return (
		<article
			className={`flex w-full flex-col rounded-xl ${
				isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
			}`}
		>
			<div className="flex items-start justify-between">
				<div className="flex w-full flex-1 flex-row gap-4">
					<div className="flex flex-col items-center">
						<Link href={`/profile/${author.id}`} className="relative h-11 w-11">
							<Image
								src={author.image}
								alt="Profile image"
								fill
								className="cursor-pointer rounded-full"
							/>
						</Link>
						<div className="noti-card_bar" />
					</div>
					<div className="flex w-full flex-col">
						<Link href={`/profile/${author.id}`} className="w-fit">
							<h4 className="cursor-pointer text-base-semibold text-light-1">
								{author.name}
							</h4>
						</Link>
						<p className="mt-2 text-small-regular text-light-2">{content}</p>

						<div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
							<div className="flex gap-3.5">
								<div className="flex flex-row gap-1">
									<LikeButton
										notiId={id.toString()}
										userId={currentUser.toString()}
										likes={likes.map((like: any) => like.toString())}
									/>
									{likes?.length > 0 && (
										<p className="mt-1 text-subtle-medium text-gray-1">
											{`${likes.length} ${likes.length > 1 ? "likes" : "like"}`}
										</p>
									)}
								</div>

								<div className="flex flex-row gap-1">
									<Link href={`/noti/${id}`}>
										<Image
											src="/assets/reply.svg"
											alt="heart"
											width={24}
											height={24}
											className="cursor-pointer object-contain"
										/>
									</Link>
									{comments.length > 0 && (
										<p className="mt-1 text-subtle-medium text-gray-1">
											{`${comments.length} ${
												comments.length > 1 ? "replies" : "reply"
											}`}
										</p>
									)}
								</div>

								<Image
									src="/assets/repost.svg"
									alt="heart"
									width={24}
									height={24}
									className="cursor-pointer object-contain"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			{!isComment && (
				<div className="flex mt-5 items-center">
					<p className="text-subtle-medium text-gray-1">
						{formatDateString(createdAt)}
					</p>
				</div>
			)}
		</article>
	);
};

export default NotiCard;
