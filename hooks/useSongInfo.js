import React from 'react'
import { useEffect, useState } from 'react/cjs/react.development';
import { useRecoilState } from 'recoil';
import { currentTrackState } from '../atoms/songAtom';
import useSpotify from './useSpotify'

const useSongInfo = () => {

	const spotifyApi = useSpotify();
	const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);

	const [songInfo, setsongInfo] = useState(null);

	useEffect(() => {

		const fetchSongInfo = async () => {
			if (currentTrackId) {
				const trackInfo = await fetch(`https://api.spotify.com/v1/tracks/${currentTrackId}`, {
					headers: {
						Authorization: `Bearer ${spotifyApi.getAccessToken()}`
					}
				}).then(res => res.json())

				setsongInfo(trackInfo);

			}
		}

		fetchSongInfo();

	}, [currentTrackId, spotifyApi])

	return songInfo;
}

export default useSongInfo
