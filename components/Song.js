import React from 'react'
import { useRecoilState } from 'recoil';
import { currentTrackState, isPlayingState } from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify';
import { millisToMinutesAndSeconds } from '../lib/time';

const Song = ({ order, track }) => {

	const spotifyApi = useSpotify();

	const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

	const playSong = () => {
		setCurrentTrackId(track.track.id);
		setIsPlaying(true);

		console.log('is playing the song');

		spotifyApi.play({
			uris: [track.track.uri]
		});
	}

	return (
		<div onClick={playSong} className='grid py-4 px-5 transition-all duration-300 hover:bg-gray-900 cursor-pointer rounded-lg grid-cols-2 text-gray-500'>
			<div className='flex items-center space-x-4'>
				<p>{order + 1}</p>
				<img className='h-10 w-10' src={track?.track?.album?.images?.[0].url} alt={track.track.name} />
				<div>
					<p className='w-36 text-white lg:w-64 truncate'>{track.track.name}</p>
					<p className='w-40'>{track.track.artists[0].name}</p>
				</div>
			</div>

			<div className='flex items-center justify-between ml-auto md:ml-0'>
				<p className='hidden w-40 md:inline-block'>{track.track.album.name}</p>
				<p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
			</div>

		</div>
	)
}

export default Song;
