const dayjs = require('dayjs')
const isBetween = require('dayjs/plugin/isBetween')
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
const relativeTime = require('dayjs/plugin/relativeTime')
require('dayjs/locale/pt-br')
dayjs.extend(relativeTime)
dayjs.extend(isSameOrBefore)
dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)

export default dayjs
