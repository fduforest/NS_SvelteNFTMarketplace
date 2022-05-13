<script>
	import axios from 'axios';
	import * as yup from 'yup';
	import FileDrop from 'filedrop-svelte';
	import fileSize from 'filesize';
	import { filedrop } from 'filedrop-svelte';
	let options = {};
	import Form from '@svelteschool/svelte-forms';
	import FormData from 'form-data';
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import NFTmarketplace from '../../../../../build/contracts/NFTmarketplace';
	import { connected, web3, selectedAccount, chainId, chainData } from 'svelte-web3';
	import { mint } from '../../../stores/web3store.js';
	//import uploadToIPFS from '../../utils/pinata';
	let values;
	let files;
	let file;
	let media;

	const api_endpoint = 'http://127.0.0.1:3005/upload';
	const reader = new FileReader();

	// console.log(account);

	async function createCollection(e) {
		mint('MoonR', 'Moon');
	}

	async function handleClick(e) {
		console.log('file', file);
		console.log('name', values.title);
		console.log('description', values.description);

		if (file) {
			const formData = new FormData();
			formData.append('file', file, file.name);
			formData.append('title', values.title);
			formData.append('description', values.description);

			axios
				.post(api_endpoint, formData, {
					headers: formData.getHeaders
				})
				.then(function (response) {
					console.log(response);
					mint(response.data.hash, response.data.metadata);
				})
				.catch(function (error) {
					console.log(error);
				});
			// mint
		} else {
			console.log('no file uploaded');
		}
	}
</script>

<!-- {#if !$connected}
	<p>My application is not yet connected</p>
{:else}
	<p>Connected to chain with id {$chainId}</p>
{/if} -->
<div class="mt-5 md:mt-0 md:col-span-2">
	<Form bind:values>
		<div class="shadow sm:rounded-md sm:overflow-hidden">
			<div class="px-4 py-5 bg-white space-y-6 sm:p-6">
				<div>
					<label class="block text-sm font-medium text-gray-700"> Image* </label>
					{(console.log(file), '')}
					{#if file}
						<img class="file" src={media} alt="d" />
						<ul>
							{#each files.accepted as file}
								<li>{file.name} - {fileSize(file.size)}</li>
							{/each}
						</ul>
					{:else}
						<div
							use:filedrop={options}
							on:filedrop={(e) => {
								console.log('e.detail.files', e.detail.files);
								files = e.detail.files;
								file = files.accepted[0];
								reader.readAsDataURL(file);
								reader.onload = (e) => {
									e.target.result;
									media = e.target.result;
								};
							}}
						>
							<div
								class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 hover:border-gray-400 border-dashed rounded-md"
							>
								<div class="space-y-1 text-center">
									<svg
										class="mx-auto h-12 w-12 text-gray-400"
										stroke="currentColor"
										fill="none"
										viewBox="0 0 48 48"
										aria-hidden="true"
									>
										<path
											d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
									<div class="flex text-sm text-gray-600">
										<label
											for="file-upload"
											class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
										>
											<span>Upload a file</span>
											<input id="file-upload" name="file-upload" type="file" class="sr-only" />
										</label>
										<p class="pl-1">or drag and drop</p>
									</div>
									<p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
								</div>
							</div>
						</div>
					{/if}
				</div>
				<div class="grid grid-cols-3 gap-6">
					<div class="col-span-3 sm:col-span-2">
						<label for="title" class="block text-sm font-medium text-gray-700"> Name* </label>
						<div class="mt-1 flex rounded-md shadow-sm">
							<input
								type="text"
								name="title"
								id="title"
								class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
								placeholder="Item name"
							/>
						</div>
					</div>
				</div>
				<div>
					<label for="description" class="block text-sm font-medium text-gray-700">
						Description
					</label>
					<div class="mt-1">
						<textarea
							id="description"
							name="description"
							rows="3"
							class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
							placeholder="Provide a detailed description for your NFT."
						/>
					</div>
					<p class="mt-2 text-sm text-gray-500" />
				</div>
			</div>
		</div>
	</Form>
	<div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
		<button
			class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			on:click={handleClick}
		>
			Send
		</button>
		<button
			class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			on:click={createCollection}
		>
			createCollection
		</button>
	</div>
</div>

<!-- <pre>{JSON.stringify(values, undefined, 1)}</pre> -->
<style>
	input[type='file'] {
		display: none;
	}
	/* label {
		display: inline;
	}
	ul {
		list-style: none;
		display: flex;
		padding: 0;
	}
	li {
		padding: 0 10px;
	}
	fieldset {
		padding: 10px 0;
		border: none;
	} */
</style>
