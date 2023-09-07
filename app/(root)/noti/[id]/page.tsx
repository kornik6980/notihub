import NotiCard from "@/components/cards/NotiCard";
import Comment from "@/components/forms/Comment";
import { fetchNotiById } from "@/lib/actions/noti.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
	if (!params.id) return null;

	const user = await currentUser();
	if (!user) return null;

	const userInfo = await fetchUser(user.id);
	if (!userInfo?.onboarded) redirect("/onboarding");

	const noti = await fetchNotiById(params.id);

	return (
		<section className="relative">
			<div>
				<NotiCard
					key={noti._id}
					id={noti._id}
					currentUser={user?.id || ""}
					parentId={noti.parentId}
					content={noti.text}
					author={noti.author}
					createdAt={noti.createdAt}
					comments={noti.children}
				/>
			</div>

			<div className="mt-7">
				<Comment
					notiId={noti._id}
					currentUserImage={userInfo.image}
					currentUserId={JSON.stringify(userInfo._id)}
				/>
			</div>

			<div className="mt-10">
				{noti.children.map((comment: any) => (
					<NotiCard
						key={comment._id}
						id={comment._id}
						currentUser={user?.id || ""}
						parentId={comment.parentId}
						content={comment.text}
						author={comment.author}
						createdAt={comment.createdAt}
						comments={comment.children}
						isComment
					/>
				))}
			</div>
		</section>
	);
};

export default Page;
