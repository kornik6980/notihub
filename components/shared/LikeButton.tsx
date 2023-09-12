"use client";

import { useState } from "react";
import { handleLike } from "@/lib/actions/noti.actions";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface Props {
	notiId: string;
	userId: string;
	likes: string[];
}

const LikeButton = ({ notiId, userId, likes }: Props) => {
	const path = usePathname();

	const [isLiked, setIsLiked] = useState<boolean>(likes.includes(userId));

	return (
		<div
			onClick={() => {
				handleLike({ notiId, userId, path });
				setIsLiked((prev) => !prev);
			}}
		>
			<Image
				src={`/assets/heart-${isLiked ? "filled" : "gray"}.svg`}
				alt="heart"
				width={24}
				height={24}
				className="cursor-pointer object-contain"
			/>
		</div>
	);
};

export default LikeButton;
