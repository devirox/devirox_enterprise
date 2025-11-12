import '@testing-library/jest-dom'

// Provide a lightweight mock for next-auth default export (NextAuth)
// Tests import server-side auth config which calls NextAuth(authOptions)
// so we mock it to a function returning a minimal handler to avoid running NextAuth internals in Jest.
jest.mock('next-auth', () => ({
	__esModule: true,
	default: (opts: any) => {
		return (req: any, res: any) => {
			// minimal shape so route modules can import and execute
			return { status: 200, opts }
		}
	}
}))

// Also mock next-auth/react session helpers to avoid side effects in component tests
jest.mock('next-auth/react', () => ({
	useSession: () => ({ data: null, status: 'unauthenticated' })
}))
