import { Button } from "@react-email/button";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Html } from "@react-email/html";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";

type InviteUserEmailProps = {
	url?: string;
	host?: string;
	name?: string;
};

export default function InviteUserEmail({
	url = "https://nguyenpham.pro",
	host = "nguyenpham.pro",
	name = "Guest",
}: InviteUserEmailProps) {

	return (
		<Html>
			<Head />
			<Preview>{`Hello ${name},`}</Preview>
			<Preview>{`Sign in to ${host}`}</Preview>
			<Section style={main}>
				<Container style={container}>
					<Text style={h1}>Sign in to {host}</Text>
					<Section style={{ textAlign: "center" }}>
						<Button style={{ ...btn, padding: "12px 20px" }} href={url}>
							Sign in
						</Button>
						<Text style={text}>
							If you did not request this email, you can safely ignore it
						</Text>
					</Section>
				</Container>
			</Section>
		</Html>
	);
}

const main = {
	backgroundColor: "#ffffff",
	margin: "0 auto",
};

const container = {
	border: "1px solid #eaeaea",
	borderRadius: "5px",
	margin: "10px auto",
	padding: "20px 40px",
	width: "465px",
};

const h1 = {
	color: "#000",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "24px",
	fontWeight: "normal",
	textAlign: "center" as const,
	margin: "30px 0",
	padding: "10px 30px",
};

const text = {
	color: "#000",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	lineHeight: "24px",
};

const btn = {
	backgroundColor: "#000",
	borderRadius: "5px",
	color: "#fff",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "12px",
	fontWeight: 500,
	lineHeight: "20px",
	textDecoration: "none",
	textAlign: "center" as const,
};