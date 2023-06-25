export async function handle({ event, resolve }) {
	const response = await resolve(event, {
		filterSerializedResponseHeaders: name =>
			name == 'cache-control' || name == 'age'
	})

	return response
}
