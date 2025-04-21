import AppImage from "@/components/AppImage";
import { FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { uploadFile } from "@/lib/upload";

export function FieldUpload(props: any) {
	const { field, data, thumbnail, preview, multiple, accept, onChange } = props;

	// Set default values
	const defaultValues = {
		multiple: multiple === undefined ? true : multiple,
		preview: preview === undefined ? false : preview,
	};

	return (
		<div className="flex gap-4">
			{(preview || !defaultValues.multiple) && (
				<div id="previewimg">
					<AppImage
						src={data?.image ? data?.image : thumbnail}
						alt="preview"
						id="previewimgsrc"
						width={800}
						height={400}
						className="w-64 h-full max-h-32 object-cover border-2 border-gray-300 rounded-lg"
					/>
				</div>
			)}
			<FormControl>
				<div className="flex flex-col gap-4 w-full">
					<div className="flex items-center justify-center w-full">
						<label
							htmlFor="iploadfile"
							className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-600 dark:hover:border-gray-500">
							<div className="flex flex-col items-center justify-center pt-5 pb-6">
								<svg
									className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 20 16">
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
									/>
								</svg>
								<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
									<span className="font-semibold">Click to upload</span> or drag and drop
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
							</div>
							<Input
								type="file"
								placeholder="Image"
								multiple={defaultValues.multiple}
								accept={accept?.join(",")}
								onChange={async (e) => {
									const db = [];
									field.onChange(e.target.files);
									const files = e.target.files;
									const previewImg = document.getElementById("previewimgsrc") as HTMLImageElement;
									const previewImgList = document.getElementById("previewimgList");
									if (files) {
										for (let i = 0; i < files.length; i++) {
											const file = files[i];
											const reader = new FileReader();
											reader.onload = (e) => {
												const wrapper = document.createElement("div");
												wrapper.className = "relative";
												const img = document.createElement("img");
												img.src = e.target?.result as string;
												if (preview || !defaultValues.multiple) {
													if (previewImg) {
														previewImg.src = e.target?.result as string;
														previewImg.className = "w-64 h-full max-h-32 object-cover border-2 border-gray-300 rounded-lg";
													}
												} else {
													if (previewImgList) {
														img.className = "h-full object-cover border-2 border-gray-300 rounded-lg";
													}
													wrapper.appendChild(img);
													document.getElementById("previewimgList")?.appendChild(wrapper);
													const checkIcon = document.createElement("span");
													checkIcon.className = "absolute top-2 right-2 bg-green-500 w-2 h-2 rounded-full";
													wrapper.appendChild(checkIcon);
												}
											};
											reader.readAsDataURL(file);
											const up = await uploadFile([file]);
											if (up) {
												db.push(up);
											}
										}
									}
									if (onChange && db.length > 0) {
										onChange(db);
									}
								}}
								onBlur={field.onBlur}
								name={field.name}
								ref={field.ref}
								className="hidden"
								id="iploadfile"
							/>
						</label>
					</div>
					<div
						id="previewimgList"
						className="grid grid-cols-3 lg:grid-cols-5 gap-10"></div>
				</div>
			</FormControl>
			<FormMessage />
		</div>
	);
}
