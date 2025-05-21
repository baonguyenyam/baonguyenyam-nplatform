import { DefaultRootProps, DropZone, RootConfig } from "@/core";

// import { Footer } from "./components/Footer";
// import { Header } from "./components/Header";

export type RootProps = DefaultRootProps;

export const Root: RootConfig<RootProps> = {
	defaultProps: {
		title: "My Page",
	},
	render: ({ puck }) => {
		return (
			// <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
			// 	<Header />

			// 	<Footer />
			// </div>
			<DropZone
				className="page_layout"
				zone="default-zone"
			// style={{ flexGrow: 1 }}
			/>
		);
	},
};

export default Root;
