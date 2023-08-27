import { fetchUserNotis } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import NotiCard from "../cards/NotiCard";

interface Props {
	currentUserId: string;
	accountId: string;
	accountType: string;
}

const NotisTab = async ({ currentUserId, accountId, accountType }: Props) => {
	let result = await fetchUserNotis(accountId);
	console.log(result.notis);

	if (!result) redirect("/");

	return (
		<section className="mt-9 flex flex-col gap-10">
			{result.notis.map((noti: any) => (
				<NotiCard
					key={noti._id}
					id={noti._id}
					currentUser={currentUserId}
					parentId={noti.parentId}
					content={noti.text}
					author={
						accountType === "User"
							? { name: result.name, image: result.image, id: result.id }
							: {
									name: noti.author.name,
									image: noti.author.image,
									id: noti.author.id,
							  }
					}
					community={noti.community} //TODO
					createdAt={noti.createdAt}
					comments={noti.children}
				/>
			))}
		</section>
	);
};

export default NotisTab;
