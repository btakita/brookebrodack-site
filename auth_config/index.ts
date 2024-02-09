import { type AuthConfig } from '@auth/core'
import github_ from '@auth/core/providers/github'
import { import_meta_env_ } from 'ctx-core/env'
export const auth_config: AuthConfig = {
	// @ts-expect-error Required since accounts.email is nullable (with minimal github scope)
	adapter: modifiedDrizzleAdapter(),
	trustHost: true,
	secret: import_meta_env_().AUTH_SECRET,
	providers: [
		github_({
			clientId: import_meta_env_().AUTH_GITHUB_ID,
			clientSecret: import_meta_env_().AUTH_GITHUB_SECRET,
		}),
	],
};
