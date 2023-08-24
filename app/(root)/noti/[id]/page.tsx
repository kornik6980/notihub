import NotiCard from "@/components/cards/NotiCard";
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
					community={noti.community}
					createdAt={noti.createdAt}
					comments={noti.children}
				/>
			</div>
		</section>
	);
};

export default Page;
