const modules = import.meta.glob('./**/*.md')
const files = Promise.all(
	Object.entries(modules).map(async e => {
		const page = await e[1]()
		const path = e[0].replace(/^\.\//, '/docs/').replace(/\/\+page\.md$/, '')
		return {
			...page.metadata,
			path: path
		}
	})
)

export async function load() {
	return {
		articles: (await files)
			.filter(article => !article.hidden)
			.sort((a, b) => {
				return new Date(b.date) - new Date(a.date)
			})
	}
}
