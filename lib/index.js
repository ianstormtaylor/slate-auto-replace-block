
import escapeRegex from 'escape-regex-string'
import typeOf from 'type-of'

/**
 * A Slate plugin to automatically replace a block when a string of matching
 * text is typed.
 *
 * @param {Object} opts
 * @return {Object}
 */

function AutoReplaceBlock(opts) {
  opts.trigger = normalizeTrigger(opts.trigger)
  opts.properties = normalizeProperties(opts.properties)

  if (!opts.trigger) throw new Error('You must provide a `trigger`.')
  if (!opts.properties) throw new Error('You must provide `properties`.')

  /**
   * On before input.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onBeforeInput(e, data, state) {
    if (opts.trigger(e)) {
      return replace(e, data, state)
    }
  }

  /**
   * On key down.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onKeyDown(e, data, state) {
    if (opts.trigger(e)) {
      return replace(e, data, state)
    }
  }

  /**
   * Replace a block's properties.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function replace(e, data, state) {
    if (state.isExpanded) return

    const block = state.startBlock
    const type = block.type
    if (opts.onlyIn && !opts.onlyIn.includes(type)) return
    if (opts.ignoreIn && opts.ignoreIn.includes(type)) return

    const matches = getMatches(state)
    if (!matches) return

    e.preventDefault()

    const { start, end } = getOffsets(matches, state.startOffset)
    const properties = opts.properties(data, matches)

    return state
      .transform()
      .moveToOffsets(start, end)
      .delete()
      .setBlock(properties)
      .apply()
  }

  /**
   * Try to match a `state` with the `before` and `after` regexes.
   *
   * @param {State} state
   * @return {Object}
   */

  function getMatches(state) {
    const { startBlock, startOffset } = state
    const { text } = startBlock
    let after = null
    let before = null

    if (opts.after) {
      const string = text.slice(startOffset)
      after = string.match(opts.after)
    }

    if (opts.before) {
      const string = text.slice(0, startOffset)
      before = string.match(opts.before)
    }

    // If both sides, require that both are matched, otherwise null.
    if (opts.before && opts.after && !before) after = null
    if (opts.before && opts.after && !after) before = null

    // Return null unless we have a match.
    if (!before && !after) return null
    return { before, after }
  }

  /**
   * Return the offsets for `matches` with `start` offset.
   *
   * @param {Object} matches
   * @param {Number} start
   * @return {Object}
   */

  function getOffsets(matches, start) {
    const { before, after } = matches
    let end = start

    if (before && before[1]) start -= before[1].length
    if (after && after[1]) end += after[1].length

    return { start, end }
  }

  /**
   * Return the plugin.
   */

  return {
    onBeforeInput,
    onKeyDown
  }
}

/**
 * Parse a `trigger` string into a trigger and before matcher.
 *
 * @param {String} trigger
 * @return {Object}
 */

function parseTrigger(trigger) {
  if (typeOf(trigger) == 'regexp') {
    return {
      trigger,
      before: undefined
    }
  }

  const index = trigger.length - 1
  const before = trigger.slice(0, index)
  const last = trigger.slice(index)
  return {
    trigger: last,
    before: new RegExp(`(${escapeRegex(before)})$`)
  }
}

/**
 * Normalize a `trigger` option to a matching function.
 *
 * @param {Mixed} trigger
 * @return {Function}
 */

function normalizeTrigger(trigger) {
  switch (typeOf(trigger)) {
    case 'regexp': return e => !!e.data.match(trigger)
    case 'string': {
      switch (trigger) {
        case 'enter': return e => e.which == 13
        case 'space': return e => e.which == 32
        case 'tab': return e => e.which == 9
        default: return e => e.data == trigger
      }
    }
  }
}

/**
 * Normalize a `properties` option to a function.
 *
 * @param {Mixed} properties
 * @return {Function}
 */

function normalizeProperties(properties) {
  switch (typeOf(properties)) {
    case 'function': return properties
    case 'object': return () => properties
  }
}

/**
 * Export.
 */

export default AutoReplaceBlock
