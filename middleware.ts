import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
	const auth = req.headers.get('authorization');

	const username = process.env.BASIC_AUTH_USERNAME ?? 'prosek';
	const password = process.env.BASIC_AUTH_PASSWORD ?? 'clientpreview';

	if (auth) {
		const [scheme, encoded] = auth.split(' ');

		if (scheme === 'Basic') {
			const decoded = Buffer.from(encoded, 'base64').toString();
			const [user, pass] = decoded.split(':');

			if (user === username && pass === password) {
				return NextResponse.next();
			}
		}
	}

	return new NextResponse('Authentication required', {
		status: 401,
		headers: {
			'WWW-Authenticate': 'Basic realm="Secure Area"',
		},
	});
}
