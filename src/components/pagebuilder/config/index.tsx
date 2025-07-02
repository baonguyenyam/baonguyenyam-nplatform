import { Config, Data } from "@/core";

import { Button, ButtonProps } from "./blocks/Button";
// import { Card, CardProps } from "./blocks/Card";
import { Flex, FlexProps } from "./blocks/Flex";
import { Grid, GridProps } from "./blocks/Grid";
import { Heading, HeadingProps } from "./blocks/Heading";
import { HTML, HTMLProps } from "./blocks/HTML";
import { Logos, LogosProps } from "./blocks/Logos";
import { Section, SectionProps } from "./blocks/Section";
import { Space, SpaceProps } from "./blocks/Space";
import { Template, TemplateProps } from "./blocks/Template";
import { Text, TextProps } from "./blocks/Text";
import Root, { RootProps } from "./root";

export type { RootProps } from "./root";

export type Props = {
	Button: ButtonProps;
	HTML: HTMLProps;
	// Card: CardProps;
	Grid: GridProps;
	Section: SectionProps;
	Heading: HeadingProps;
	Flex: FlexProps;
	Logos: LogosProps;
	Template: TemplateProps;
	Text: TextProps;
	Space: SpaceProps;
};

export type UserConfig = Config<
	Props,
	RootProps,
	"layout" | "typography" | "interactive" | "template"
>;

export type UserData = Data<Props, RootProps>;

// We avoid the name config as next gets confused
export const conf: UserConfig = {
	root: Root,
	categories: {
		layout: {
			components: ["Section", "Grid", "Flex"],
		},
		typography: {
			components: ["Heading", "Text", "HTML", "Space"],
		},
		interactive: {
			title: "Actions",
			components: ["Button"],
		},
		other: {
			title: "Other",
			components: [
				// "Card",
				"Logos",
			],
		},
		template: {
			title: "Templates",
			components: ["Template"],
		},
	},
	components: {
		Button,
		Section,
		HTML,
		// Card,
		Grid,
		Heading,
		Flex,
		Logos,
		Template,
		Text,
		Space,
	},
};

export const initialData: Record<string, UserData> = {};

export const componentKey = Buffer.from(
	`${Object.keys(conf.components).join("-")}-${JSON.stringify(initialData)}`,
).toString("base64");

export default conf;
