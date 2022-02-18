const semver = require('semver')

const log = console.log

log(semver.valid('1.2.3')) // '1.2.3'
log(semver.valid('a.b.c')) // null
log(semver.clean('  =v1.2.3   ')) // '1.2.3'
log(semver.satisfies('1.2.3', '1.x || >=2.5.0 || 5.0.0 - 7.2.3')) // true
log(semver.gt('1.2.3', '9.8.7')) // false
log(semver.lt('1.2.3', '9.8.7')) // true
log(semver.minVersion('>=1.0.0')) // '1.0.0'
log(semver.valid(semver.coerce('v2'))) // '2.0.0'
log(semver.valid(semver.coerce('42.6.7.9.3-alpha'))) // '42.6.7'
