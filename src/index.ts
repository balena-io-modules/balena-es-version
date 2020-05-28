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

export const set = (version: ValidVersion) => {
	const versionIndex = validVersions[version];
	if (versionIndex == null) {
		throw new Error('Invalid es version to set: ' + version);
	}
	desiredVersionIndex = versionIndex;
};

export const get = (supportedVersions?: ValidVersion[]) => {
	if (supportedVersions == null) {
		// If no supported version array is passed just return the desired version
		return validVersions[desiredVersionIndex];
	}

	// Otherwise check for the closest matching supported version and return that, priority is:
	// 1st: exact match
	// 2nd: closest match under
	// 3rd: closest match over
	// 4th: error
	let closestVersionUnder: number | undefined;
	let closestVersionOver: number | undefined;
	for (const supportedVersion of supportedVersions) {
		const supportedVersionIndex = validVersions[supportedVersion];
		if (supportedVersionIndex === desiredVersionIndex) {
			// 1st priority: exact match
			return validVersions[desiredVersionIndex];
		}
		if (supportedVersionIndex !== -1) {
			// Only include versions we know about
			if (supportedVersionIndex < desiredVersionIndex) {
				if (
					closestVersionUnder == null ||
					supportedVersionIndex > closestVersionUnder
				) {
					// If the version is under the desired version but closer than previous then we update to use it
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
	}
	if (closestVersionUnder != null) {
		// 2nd priority: closest match under
		return closestVersionUnder;
	}
	if (closestVersionOver != null) {
		// 3rd priority: closest match over
		return closestVersionOver;
	}
	// 4th priority: error
	throw new Error(
		'No supported versions for @balena/es-version: ' + supportedVersions.join(),
	);
};
