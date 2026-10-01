import React from "react";

export default function Page({ slug, content }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<title>{slug}</title>
				<link rel="stylesheet" href="/css/style.css" />
			</head>
			<body>
				<h1>{slug}</h1>
				<div
					className="main"
					dangerouslySetInnerHTML={{ __html: content }}
				/>
				<a href="../..">back</a>
			</body>
		</html>
	);
}
