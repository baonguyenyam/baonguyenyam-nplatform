import { useState } from "react";
import type { UploadFile, UploadProps } from "antd";
import { Upload } from "antd"; // Keep Upload from antd if preferred for multi-upload UI
import { Inbox } from "lucide-react";
import { toast } from "sonner";

import AppImage from "@/components/AppImage";
import { FormControl, FormMessage } from "@/components/ui/form";
import { uploadFile } from "@/lib/upload";

import { Input } from "../ui/input";

// State for the upload dialog
interface UploadDialogState {
	isOpen: boolean;
	fileList: UploadFile[]; // Use Ant Design's UploadFile type
}

export function FieldUpload(props: any) {
	const { field, data, thumbnail, preview, multiple, accept, onChange } = props;
	const [uploadDialogState, setUploadDialogState] = useState<UploadDialogState>({ isOpen: false, fileList: [] });

	// Set default values
	const defaultValues = {
		multiple: multiple === undefined ? true : multiple,
		preview: preview === undefined ? false : preview,
	};

	// --- Upload Logic ---
	const uploadProps: UploadProps = {
		name: "file",
		multiple: defaultValues?.multiple ? true : false,
		listType: "picture",
		fileList: uploadDialogState.fileList,
		// Accept file types
		accept: accept?.join(","),
		showUploadList: preview ? true : false,
		// Use customRequest to handle the upload via your utility
		customRequest: async ({ file, onSuccess, onError }) => {
			try {
				// Ensure file is of type File
				if (!(file instanceof File)) {
					throw new Error("Invalid file type provided to upload.");
				}
				const result = await uploadFile([file]); // Use your uploadFile utility
				if (result?.success && result?.data && result.data.length > 0) {
					if (onSuccess) onSuccess(result.data[0], new XMLHttpRequest()); // Pass result data to onSuccess
					const previewImg = document.getElementById("previewimgsrc") as HTMLImageElement;
					if (previewImg) {
						previewImg.src = result.data[0].url; // Assuming result.data[0].url contains the image URL
						previewImg.className = "w-64 h-full max-h-32 object-cover border-2 border-gray-300 rounded-lg";
					}
					if (onChange) {
						onChange([result]); // Call onChange with the uploaded file data
					}
					// toast.success(`"${file.name}" uploaded successfully.`);
					// fetchData(); // Refresh the table data
				} else {
					throw new Error(result?.message || "Upload failed");
				}
			} catch (error: any) {
				console.error("Upload error:", error);
				toast.error(`"${(file as File).name}" upload failed: ${error.message}`);
				if (onError) onError(error);
			}
		},
		onChange(info) {
			setUploadDialogState((prev) => ({ ...prev, fileList: info.fileList }));
			// Optional: Handle status changes if needed, though customRequest handles success/error
			// if (info.file.status === 'done') { ... }
			// if (info.file.status === 'error') { ... }
		},
		onRemove(file) {
			// Optional: If you need to delete already uploaded files from this interface
			// This might be complex if the file is already in Supabase storage
			// Consider if removal should only happen before upload or trigger a delete action
			console.log("Remove file:", file.name);
			// Default behavior removes from list; add delete logic if needed
			// await actions.deleteRecord(file.uid); // Example: Requires mapping uid to your record ID
		},
	};


	return (
		<div className="flex gap-4">
			{thumbnail && (
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
					{/* <label
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
					</label> */}
					<div className="overflow-auto pb-2" id="upload">
						<Upload.Dragger {...uploadProps} style={{ maxHeight: "150px" }}>
							<p className="ant-upload-drag-icon">
								<Inbox className="mx-auto h-12 w-12 text-gray-400" />
							</p>
							<p className="ant-upload-text">Click or drag file to this area to upload</p>
							<p className="ant-upload-hint">Support for single or bulk upload.</p>
						</Upload.Dragger>
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
