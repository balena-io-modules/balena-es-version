// These must be ordered correctly
enum validVersions {
	'es3',
	'es5',
	'es2015',
	'es2016',
	'es2017',
	'es2018',
	'es2019',
	'es2020',
	'esnext',
}

export type ValidVersion = keyof typeof validVersions;

let desiredVersionIndex = 0;

export const set = (version: ValidVersion): void => {
	const versionIndex = validVersions[version];
	if (versionIndex == null) {
		throw new Error('Invalid es version to set: ' + version);
	}
	desiredVersionIndex = versionIndex;
};

export const get = (supportedVersions?: ValidVersion[]): ValidVersion => {
	if (supportedVersions == null) {
		// If no supported version array is passed just return the desired version
		return validVersions[desiredVersionIndex] as ValidVersion;
	}

	if (supportedVersions.length === 0) {
		throw new Error(
			'Empty array of supported versions passed to @balena/es-version get',
		);
	}

	// Otherwise check for the closest matching supported version and return that, priority is:
	// 1st: exact match
	// 2nd: closest match under
	// 3rd: lowest supported version
	let closestVersionUnder: number | undefined;
	let closestVersionOver: number | undefined;
	for (const supportedVersion of supportedVersions) {
		const supportedVersionIndex = validVersions[supportedVersion];
		if (supportedVersionIndex == null) {
			// Throw if there's an invalid version
			throw new Error(
				'Invalid version for @balena/es-version get: ' + supportedVersion,
			);
		}
		if (supportedVersionIndex <= desiredVersionIndex) {
			if (
				closestVersionUnder == null ||
				supportedVersionIndex > closestVersionUnder
			) {
				// If the version is under or equal to the desired version and closer than previous then we update to use it
				closestVersionUnder = supportedVersionIndex;
			}
		} else {
			if (
				closestVersionOver == null ||
				supportedVersionIndex < closestVersionOver
			) {
				// If the version is over the desired version but closer than previous then we update to use it
				closestVersionOver = supportedVersionIndex;
			}
		}
	}
	if (closestVersionUnder != null) {
		// 1st/2nd priority: exact match or the closest match under
		return validVersions[closestVersionUnder] as ValidVersion;
	}
	if (closestVersionOver != null) {
		// 3rd priority: lowest supported version
		return validVersions[closestVersionOver] as ValidVersion;
	}
	// We shouldn't be able to reach here but we check the case for typescript
	throw new Error(
		'No supported versions for @balena/es-version: ' + supportedVersions.join(),
	);
};
