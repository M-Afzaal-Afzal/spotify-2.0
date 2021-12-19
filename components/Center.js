import React, { useEffect, useState } from 'react';
import { signOut, useSession } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { shuffle } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/PlaylistAtom';
import useSpotify from "../hooks/useSpotify";
import Songs from './Songs';

const colors = [
	'from-indigo-500',
	'from-blue-500',
	'from-green-500',
	'from-red-500',
	'from-yellow-500',
	'from-pink-500',
	'from-purple-500'
]

const Center = () => {

	const { data: session } = useSession();
	const [color, setColor] = useState(null);

	const SpotifyApi = useSpotify();

	const playlistId = useRecoilValue(playlistIdState);
	const [playlist, setPlaylist] = useRecoilState(playlistState)


	useEffect(() => {
		setColor(shuffle(colors).pop());
	}, [playlistId])

	useEffect(() => {
		SpotifyApi.getPlaylist(playlistId)
			.then(data => {
				setPlaylist(data.body)
			})
			.catch(err => {
				console.log('Something went wrong', err);
			})
	}, [SpotifyApi, playlistId]);

	console.log(playlist, 'playlist is there');

	return (
		<div className={'flex-grow relative h-screen scrollbar-hide overflow-y-scroll'}>
			<header className={'absolute top-5 right-8'}>
				<div onClick={signOut} className={'flex items-center text-white bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2'}>
					<img className={'w-10 h-10 rounded-full'} src={session?.user?.image} alt={session?.user?.name} />
					<h2>{session?.user?.name}</h2>
					<ChevronDownIcon className={'w-5 h-5'} />
				</div>
			</header>

			<section className={`flex w-full items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
				<img className='h-auto w-44 shadow-2xl' src={playlist?.images?.[0].url} alt="" />
				<div>
					<p>Playlist</p>
					<h1 className='text-2xl md:text-3xl lg:text-5xl font-bold'>{playlist?.name}</h1>
				</div>
			</section>

			<div>
				{/* songs */}
				<Songs />
			</div>

		</div>
	);
};

export default Center;