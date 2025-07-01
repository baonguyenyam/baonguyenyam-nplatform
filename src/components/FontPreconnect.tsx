import Head from 'next/head';

export default function FontPreconnect() {
	return (
		<Head>
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
		</Head>
	);
}
