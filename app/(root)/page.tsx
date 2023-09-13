import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import NotiCard from "@/components/cards/NotiCard";
import Pagination from "@/components/shared/Pagination";

import { fetchNotis } from "@/lib/actions/noti.actions";
import { fetchUser } from "@/lib/actions/user.actions";

export default async function Home({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const user = await currentUser();
	if (!user) redirect("/sign-in");

	const userInfo = await fetchUser(user.id);

	const result = await fetchNotis(
		searchParams.page ? +searchParams.page : 1,
		30
	);

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

			<Pagination
				path="/"
				pageNumber={searchParams?.page ? +searchParams.page : 1}
				isNext={result.isNext}
			/>
		</>
	);
}
