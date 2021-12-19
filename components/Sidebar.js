import React, { useEffect, useState } from 'react'
import { LogoutIcon, SearchIcon, LibraryIcon, PlusCircleIcon, HomeIcon, RssIcon } from '@heroicons/react/outline'
import { HeartIcon } from '@heroicons/react/solid';
import { signOut, useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/PlaylistAtom';

const Sidebar = () => {
	const spotifyApi = useSpotify();
	const { data: session, status } = useSession();
	const [playlist, setPlaylist] = useState(null);
	const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

	console.log(session, 'session')

	useEffect(() => {
		if (spotifyApi.getAccessToken()) {
			spotifyApi.getUserPlaylists().then(data => {
				console.log(data, 'data')
				setPlaylist(data.body.items);
			})
		}
	}, [session, spotifyApi]);

	console.log(playlistId, 'playlist')

	return (
		<div className='hidden md:inline-block sm:max-w-[12rem] lg:max-w-[15rem] text-gray-500 scrollbar-hide overflow-y-scroll h-screen space-y-4 p-5 text-xs lg:text-sm border-r border-gray-900'>

			{/*  top section */}

			{/* <button onClick={() => signOut()} className='flex items-center space-x-2 hover:text-white'>
				<LogoutIcon className='w-5 h-5' />
				<p>Log Out</p>
			</button> */}

			<button className='flex items-center space-x-2 hover:text-white'>
				<HomeIcon className='w-5 h-5' />
				<p>Home</p>
			</button>

			<button className='flex items-center space-x-2 hover:text-white'>
				<SearchIcon className='w-5 h-5' />
				<p>Search</p>
			</button>

			<button className='flex items-center space-x-2 hover:text-white'>
				<LibraryIcon className='w-5 h-5' />
				<p>Your Library</p>
			</button>

			<hr className='border-t-[.1px] border-gray-900' />




			<button className='flex items-center space-x-2 hover:text-white'>
				<PlusCircleIcon className='w-5 h-5' />
				<p>Create Playlist</p>
			</button>

			<button className='flex items-center  space-x-2 hover:text-white'>
				<HeartIcon className='w-5 h-5 text-blue-500' />
				<p>Liked Songs</p>
			</button>

			<button className='flex items-center space-x-2 hover:text-white'>
				<RssIcon className='w-5 h-5' />
				<p>Your Episode</p>
			</button>

			<hr className='border-t-[.1px] border-gray-900' />

			{/* Playlist */}
			{
				Array.isArray(playlist) && playlist.map(playlist => {
					return (
						<p onClick={() => setPlaylistId(playlist.id)} key={playlist.id} className='cursor-pointer hover:text-white'>
							{playlist.name}
						</p>
					)
				})
			}

			{/* <p className='cursor-pointer hover:text-white'>Playlist Name</p>
			<p className='cursor-pointer hover:text-white'>Playlist Name</p>
			<p className='cursor-pointer hover:text-white'>Playlist Name</p>
			<p className='cursor-pointer hover:text-white'>Playlist Name</p>
			<p className='cursor-pointer hover:text-white'>Playlist Name</p>
			<p className='cursor-pointer hover:text-white'>Playlist Name</p>
			<p className='cursor-pointer hover:text-white'>Playlist Name</p>
			<p className='cursor-pointer hover:text-white'>Playlist Name</p>
			<p className='cursor-pointer hover:text-white'>Playlist Name</p>
			<p className='cursor-pointer hover:text-white'>Playlist Name</p>
			<p className='cursor-pointer hover:text-white'>Playlist Name</p>
			<p className='cursor-pointer hover:text-white'>Playlist Name</p>
			<p className='cursor-pointer hover:text-white'>Playlist Name</p> */}

		</div>
	)
}

export default Sidebar
