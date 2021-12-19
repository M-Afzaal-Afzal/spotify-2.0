import React from 'react';
import {getProviders,signIn} from "next-auth/react";

export const getServerSideProps = async () => {
	const providers = await getProviders();

	return {
		props: {
			providers,
		}
	}
}

const Login = ({providers}) => {
	return (
		<div className={'flex flex-col items-center bg-black justify-center w-full min-h-screen'}>
			<img className={'w-52 mb-5'} src="https://links.papareact.com/9xl" alt="Spotify"/>

			{
				Object.values(providers).map(provider => {

					console.log(provider)

					return(
						<div key={provider.id}>
							<button onClick={() => signIn(provider.id,{
								callbackUrl: '/'
							})}
									className={'bg-[#18D860] text-white p-5 rounded-full'}
							>
								Login with {provider.name}
							</button>
						</div>
					)
				})
			}

		</div>
	)
}

export default Login;
