import { X } from "lucide-react";
import { toast } from "sonner";

import AppImage from "@/components/AppImage";

import { Button } from "../ui/button";

export function ImageList(props: { role?: any; data?: any; thumbnail?: any; setThumbnail?: any; fetchData?: any; onChange?: any }) {
	const { role, data, thumbnail, setThumbnail, fetchData, onChange } = props;

	return (
		<>
			{data && data.files && data.files.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
					{data.files.map((item: any) => (
						<div
							key={item.id}
							className="flex items-center flex-col gap-3 group relative">
							<div className="relative">
								<AppImage
									src={item.url}
									alt="preview"
									width={150}
									height={150}
									className="w-[150px] h-[150px] object-cover border-1 border-gray-300 rounded-lg"
								/>
								{role === "ADMIN" && (
									<Button
										type="button"
										size="icon"
										variant="destructive"
										onClick={async () => {
											if (confirm("Are you sure you want to delete this record?")) {
												const del = await fetch(`/api/admin/files/${item.id}`, {
													method: "POST",
												});
												const res = await del.json();
												if (res.success === "success") {
													toast.success(res.message);
													fetchData();
												} else {
													toast.error(res.message);
												}
											}
										}}
										className="text-xs rounded-full w-5 h-5 absolute -top-2 -right-2">
										<X className="text-white" />
									</Button>
								)}
							</div>
							{thumbnail === item.url && <span className="bg-white shadow text-black px-3 py-2 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Thumbnail</span>}
							{thumbnail !== item.url && (
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setThumbnail(item.url);
										if (onChange) {
											onChange(item.url);
										}
										const preview = document.getElementById("previewimg");
										if (preview) {
											preview.innerHTML = "";
											const img = document.createElement("img");
											img.src = item.url;
											img.className = "w-64 h-full max-h-32 object-cover border-2 border-gray-300 rounded-lg";
											document.getElementById("previewimg")?.appendChild(img);
										}
									}}
									className="text-xs hidden group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
									Set as Thumbnail
								</Button>
							)}
						</div>
					))}
				</div>
			) : (
				<div className="">
					<span>No files uploaded</span>
				</div>
			)}
		</>
	);
}
