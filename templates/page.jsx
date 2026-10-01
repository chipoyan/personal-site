import React from "react";

export default function Page({ slug, content }) {
	const title = slug.replaceAll("_", " ");
	return (
		<html lang="en">
			<head>
				<meta
					charSet="utf-8"
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<title>{title}</title>
				<link rel="stylesheet" href="../../css/style.css" />
			</head>
			<body>
				<h1>{title}</h1>
				<div
					className="main"
					dangerouslySetInnerHTML={{ __html: content }}
				/>
				<a href="../..">back</a>
			</body>
		</html>
	);
}
