import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
	'user-read-private',
	'user-read-email',
	`user-follow-modify`,
	`user-follow-read`,
	`playlist-modify-private`,
	`playlist-read-collaborative`,
	`playlist-read-private`,
	`playlist-modify-public`,
	`user-read-playback-position`,
	`user-top-read`,
	`user-read-recently-played`,
	`streaming`,
	`app-remote-control`,
	// `user-library-modify`,
	`user-library-read`,
	`user-read-playback-state`,
	`user-modify-playback-state`,
	`user-read-currently-playing`
].join(',');

const params = {
	scope: scopes
};

const queryParamsString = new URLSearchParams(params);

export const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamsString.toString()}`

export const SpotifyApi = new SpotifyWebApi({
	clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
	clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
	// redirectUri: 'http://www.example.com/callback'
});
