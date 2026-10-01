import React from "react";

export default function Index({ pages }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<title>Index</title>
				<link rel="stylesheet" href="/css/style.css" />
			</head>
			<body>
				<h1>All Pages</h1>
				<ul>
					{pages.map(({ slug }) => (
						<li key={slug}>
							<a href={`./posts/${slug}/`}>{slug}</a>
						</li>
					))}
				</ul>
			</body>
		</html>
	);
}
