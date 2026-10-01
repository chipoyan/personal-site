import React from "react";

export default function Index({ pages }) {
	return (
		<html lang="en">
			<head>
				<meta
					charSet="utf-8"
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<title>Index</title>
				<link rel="stylesheet" href="./css/style.css" />
			</head>
			<body>
				<h1>personal site of Albert Wen</h1>
				{pages.map(({ slug }) => (
					<div key={slug}>
						<a href={`./posts/${slug}/`}>{slug}</a>
					</div>
				))}
			</body>
		</html>
	);
}
