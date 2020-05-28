import * as balenaEsVersion from '..';
import { expect } from 'chai';

it('should default to es3', () => {
	expect(balenaEsVersion.get()).to.equal('es3');
});

it('should return the desired version if listed', () => {
	expect(balenaEsVersion.get(['es2018', 'es2016', 'es3'])).to.equal('es3');
});

it('should default to the lowest supported version if there is none below/matching the desired', () => {
	expect(balenaEsVersion.get(['es2018', 'es2016', 'es2015'])).to.equal(
		'es2015',
	);
});

it('should fail to get an invalid version', () => {
	expect(() => {
		// @ts-expect-error
		balenaEsVersion.get('invalid');
	}).to.throw();
});

it('should fail to set an invalid version', () => {
	expect(() => {
		// @ts-expect-error
		balenaEsVersion.set('invalid');
	}).to.throw();
	expect(balenaEsVersion.get()).to.equal('es3');
});

it('should allow setting a valid version', () => {
	balenaEsVersion.set('es2017');
	expect(balenaEsVersion.get()).to.equal('es2017');
});

it('should use the closest version under', () => {
	expect(balenaEsVersion.get(['es2018', 'es2016', 'es2015'])).to.equal(
		'es2016',
	);
});
