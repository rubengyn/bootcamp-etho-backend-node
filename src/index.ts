async function getUser() {
	const githubResponse = fetch(`https://api.github.com/users/laracarvalho`).then(githubResponse => {
  		githubResponse.json().then(user => {
			console.log(user);
		});
	});
}

getUser();