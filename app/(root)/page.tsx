import NotiCard from "@/components/cards/NotiCard";
import { fetchNotis } from "@/lib/actions/noti.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
	const result = await fetchNotis(1, 30);
	const user = await currentUser();
	if (!user) return null;

	const userInfo = await fetchUser(user.id);

	return (
		<>
			<h1 className="head-text text-left">Home</h1>

			<section className="mt-9 flex flex-col gap-10">
				{result.notis.length === 0 ? (
					<p className="no-result">No notis found</p>
				) : (
					<>
						{result.notis.map((noti) => (
							<NotiCard
								key={noti._id}
								id={noti._id}
								currentUser={userInfo._id || ""}
								parentId={noti.parentId}
								content={noti.text}
								author={noti.author}
								createdAt={noti.createdAt}
								comments={noti.children}
								likes={noti.likes}
							/>
						))}
					</>
				)}
			</section>
		</>
	);
}
