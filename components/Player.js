import { VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline';
import { RewindIcon, SwitchHorizontalIcon, FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, VolumeUpIcon } from '@heroicons/react/solid';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import React, { useCallback } from 'react'
import { useEffect, useState } from 'react/cjs/react.development';
import { useRecoilState } from 'recoil';
import { currentTrackState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify'

const Player = () => {

	const spotifyApi = useSpotify();
	const { data: session, status } = useSession();

	const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
	const [volume, setVolume] = useState(50);

	const songInfo = useSongInfo();

	const fetchCurrentSong = () => {
		if (!songInfo) {
			spotifyApi.getMyCurrentPlayingTrack()
				.then(data => {
					console.log('now playing', data?.body?.item);
					setCurrentTrackId(data?.body?.item?.id);

					spotifyApi.getMyCurrentPlaybackState().then(data => {
						setIsPlaying(data?.body?.is_playing);
					})
				});
		}
	}

	useEffect(() => {

		if (spotifyApi.getAccessToken() && !currentTrackId) {
			//  fetch the song info
			fetchCurrentSong();
			setVolume(50);
		}

	}, [currentTrackId, spotifyApi, session])

	const handlePlayPause = () => {
		spotifyApi.getMyCurrentPlaybackState().then((data) => {
			if (data?.body?.is_playing) {
				spotifyApi.pause();
				setIsPlaying(false);
			} else {
				spotifyApi.play();
				setIsPlaying(true);
			}

		})
	}

	useEffect(() => {
		if (volume > 0 && volume < 100) {
			debouncedAdjustedVolume(volume);
		}

	}, [volume])

	const debouncedAdjustedVolume = useCallback(
		debounce((volume) => {
			spotifyApi.setVolume(volume).catch(err => {
				console.log(err);
			});
		}, 500),
		[],
	)

	return (
		<div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
			{/* Left */}
			<div className='flex items-center space-x-4'>
				<div>
					<img className='hidden md:inline-block h-10 w-10' src={songInfo?.album?.images?.[0].url} alt="" />
				</div>
				<div>
					<h3>{songInfo?.name}</h3>
					<p>{songInfo?.artists?.[0]?.name}</p>
				</div>
			</div>

			{/* Center */}
			<div className='flex items-center justify-evenly'>
				<SwitchHorizontalIcon className='button' />
				<RewindIcon className='button' />
				{
					isPlaying ? (
						<PauseIcon onClick={handlePlayPause} className='button' />
					) : (
						<PlayIcon onClick={handlePlayPause} className='button' />
					)
				}
				<FastForwardIcon className='button' />
				<ReplyIcon className='button' />
			</div>

			{/* Right Side */}
			<div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
				<VolumeDownIcon onClick={() => volume > 0 && setVolume(volume - 10)} className='button' />
				<input onChange={(e) => {
					setVolume(Number(e.target.value))
				}} className='w-14 md:w-28' type="range" value={volume} min={0} max={100} />
				<VolumeUpIcon onClick={() => volume < 100 && setVolume(volume + 10)} className='button' />
			</div>

		</div>
	)
}

export default Player
