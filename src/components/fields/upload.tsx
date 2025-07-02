import React, { useState } from "react"; // Import React
import type { UploadFile, UploadProps } from "antd";
import { Spin, Upload } from "antd"; // Import Spin for loading indicator
import { Inbox, Loader2 } from "lucide-react"; // Using Loader2 for a spinner icon
import { toast } from "sonner";

import AppImage from "@/components/AppImage";
import { FormControl, FormMessage } from "@/components/ui/form";
import { uploadFile } from "@/lib/upload";

// State for the upload dialog
interface UploadDialogState {
	isOpen: boolean;
	fileList: UploadFile[]; // Use Ant Design's UploadFile type
}

export function FieldUpload(props: any) {
	const { field, data, thumbnail, preview, multiple, accept, onChange } = props;
	const [uploadDialogState, setUploadDialogState] = useState<UploadDialogState>(
		{ isOpen: false, fileList: [] },
	);
	// --- Add state to track uploading status ---
	const [isUploading, setIsUploading] = useState(false);

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
		// Keep showUploadList configuration as is or adjust as needed
		showUploadList: preview
			? {
					showRemoveIcon: false,
					showDownloadIcon: false,
				}
			: false,
		// Use customRequest to handle the upload via your utility
		customRequest: async ({ file, onSuccess, onError }) => {
			// --- Set uploading state to true when starting ---
			// Note: antd's onChange usually handles this visually if showUploadList is true
			// But we set our state for the custom indicator inside the dragger
			setIsUploading(true);
			try {
				// Ensure file is of type File
				if (!(file instanceof File)) {
					throw new Error("Invalid file type provided to upload.");
				}
				const result = await uploadFile([file]); // Use your uploadFile utility

				// --- Reset uploading state on success/error ---
				// Note: This happens *before* onSuccess/onError might trigger onChange
				// We rely on onChange below to give the final status update

				if (result?.success && result?.data && result.data.length > 0) {
					if (onSuccess) onSuccess(result.data[0], new XMLHttpRequest()); // Pass result data to onSuccess
					const previewImg = document.getElementById(
						"previewimgsrc",
					) as HTMLImageElement;
					if (previewImg) {
						previewImg.src = result.data[0].url; // Assuming result.data[0].url contains the image URL
						previewImg.className =
							"w-64 h-full max-h-32 object-cover border-2 border-gray-300 rounded-lg";
					}
					if (onChange) {
						onChange([result]); // Call onChange with the uploaded file data
					}
					// Optional success toast
					// toast.success(`"${file.name}" uploaded successfully.`);
				} else {
					throw new Error(result?.message || "Upload failed");
				}
			} catch (error: any) {
				console.error("Upload error:", error);
				toast.error(`"${(file as File).name}" upload failed: ${error.message}`);
				if (onError) onError(error);
			} finally {
				// --- Ensure uploading state is reset even if customRequest finishes before onChange ---
				// We check the latest fileList status in onChange for robustness
				// setIsUploading(false); // Let onChange handle the final state
			}
		},
		onChange(info) {
			// --- Update file list state ---
			setUploadDialogState((prev) => ({ ...prev, fileList: info.fileList }));

			// --- Update isUploading state based on the status of files in the list ---
			const currentlyUploading = info.fileList.some(
				(f) => f.status === "uploading",
			);
			setIsUploading(currentlyUploading);

			// --- Handle final status messages (optional) ---
			if (info.file.status === "done") {
				// You could add a success toast here if not done in customRequest
				// toast.success(`${info.file.name} file uploaded successfully`);
			} else if (info.file.status === "error") {
				// Error toast is already handled in customRequest's catch block
				// toast.error(`${info.file.name} file upload failed.`);
			}
		},
		onRemove(file) {
			console.log("Remove file:", file.name);
			// Add delete logic here if needed when removing from the list
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
					{/* --- Upload Dragger --- */}
					{/* --- Updated Upload Dragger --- */}
					{/* --- Upload Dragger --- */}
					{/* --- Updated Upload Dragger --- */}
					<div className="overflow-auto pb-2" id="upload">
						<Upload.Dragger {...uploadProps} style={{ maxHeight: "150px" }}>
							{isUploading ? (
								// --- Show loading indicator when uploading ---
								<div className="flex flex-col items-center justify-center h-full py-4">
									<Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin dark:text-gray-200!" />
									<p className="ant-upload-text mt-2 text-gray-400 dark:text-gray-200!">
										Uploading...
									</p>
									<p className="ant-upload-hint text-gray-400 dark:text-gray-200!">
										Please wait.
									</p>
								</div>
							) : (
								// --- Show default content when not uploading ---
								<>
									<p className="ant-upload-drag-icon">
										<Inbox className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-200!" />
									</p>
									<p className="ant-upload-text text-gray-400 dark:text-gray-200!">
										Click or drag file to this area to upload
									</p>
									<p className="ant-upload-hint text-gray-400 dark:text-gray-200!">
										Support for single or bulk upload.
									</p>
								</>
							)}
						</Upload.Dragger>
					</div>
					{/* --- End Updated Upload Dragger --- */}
					<div
						id="previewimgList"
						className="grid grid-cols-3 lg:grid-cols-5 gap-10"
					></div>
				</div>
			</FormControl>
			<FormMessage />
		</div>
	);
}
