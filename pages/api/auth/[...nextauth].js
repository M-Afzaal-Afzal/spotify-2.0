import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import {SpotifyApi,LOGIN_URL} from "../../../lib/spotify";

async function refreshAccessToken(token) {
	try {
		SpotifyApi.setAccessToken(token.accessToken);
		SpotifyApi.setRefreshToken(token.refreshToken);

		const {body: refreshedAccessToken} = await SpotifyApi.refreshAccessToken();

		console.log('refreshed access token',refreshedAccessToken)

		return {
			...token,
			accessToken: refreshedAccessToken.access_token,
			accessTokenExpires: Date.now() + refreshedAccessToken.expires_in * 1000,
			refreshToken: refreshedAccessToken.refresh_token ?? token.refreshToken,
		}

	} catch (error) {
		console.log(error);
		return {
			...token,
			error: 'RefreshAccessTokenError',
		}

	}
}

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		SpotifyProvider({
			clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
			clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
			authorization: LOGIN_URL
		}),
		// ...add more providers here
	],
	secret: process.env.JWT_SECRET,
	pages: {
		signIn: '/login',
	},
	callbacks: {
		async jwt({token,account,user}){

			if (account && user) {
				return {
					...token,
					accessToken: token.access_token,
					accessTokenExpires: Date.now() + account.expires_in * 1000,
					refreshToken: account.refresh_token,
					username: account.providerAccountId,
					user,
				}
			}

			// Return previous token if the access token has not expired yet
			if (Date.now() < token.accessTokenExpires) {
				console.log('access token is valid', token);
				return token
			}

			// Access token has expired, try to update it
			console.log('access token has expired, refreshing',token)
			return refreshAccessToken(token)

		},

		async session({ session, token }) {
			session.user.refreshToken = token.refreshToken;
			session.user = token.user;
			// session.token = token;
			session.user.accessToken = token.accessToken;
			session.error = token.error;
			// session.userName=token.userName;

			return session
		},
	}
});