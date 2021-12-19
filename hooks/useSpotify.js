import React, {useEffect} from 'react';
import {signIn, useSession} from "next-auth/react";
import SpotifyWebApi from "spotify-web-api-node";

const SpotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
    // redirectUri: 'http://www.example.com/callback'
});

const useSpotify = () => {
    const {data:session} = useSession();

    useEffect(() => {
        if (session) {
            if (session.error === 'RefreshAccessTokenError') {
                signIn();
            }

            SpotifyApi.setAccessToken(session.user.accessToken);
        }
    },[session])

   return SpotifyApi;
};

export default useSpotify;