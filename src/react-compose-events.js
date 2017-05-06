import { compose, withProps, withHandlers, lifecycle } from 'recompose'

/**
 * Helper method to resolve the target from either
 */
const eventTargetGetter = _eventTarget => props => () => typeof _eventTarget === 'function'
  ? _eventTarget(props)
  : _eventTarget

/**
 * Resolve function/object event handlers map.
 */
const resolveEventHandlers = events => props => ({
  _eventHandlers: typeof events === 'function' ? events(props) : events
})

const attach = ({ _getEventTarget }) => (f, e) => _getEventTarget().addEventListener(e, f)
const detach = ({ _getEventTarget }) => (f, e) => _getEventTarget().removeEventListener(e, f)

function componentDidMount () {
  Object.keys(this.props._eventHandlers).forEach(
    event => this.props.attach(this.props._eventHandlers[event], event)
  )
}

function componentWillUnmount () {
  Object.keys(this.props._eventHandlers).forEach(
    event => this.props.detach(this.props._eventHandlers[event], event)
  )
}

/**
 * withEventListeners HoC factory.
 *
 * @param {Object|Function} _eventTarget EventTarget instance (such as DOM elements,
 * window objects, document, or anything with addEventListener and removeEventListener).
 * Can also be a function, which will be called with the piping props and must return
 * an EventTarget.
 *
 * @param {Object|Function} _eventHandlers Map of event names as keys to handlers as
 * values. Can also be a function, which will be called with the piping props and must
 * return the previously described object map.
 *
 * @return HoC.
 */
export default (_eventTarget, _eventHandlers) => compose(
  withHandlers({ _getEventTarget: eventTargetGetter(_eventTarget) }),
  withProps(resolveEventHandlers(_eventHandlers)),
  withHandlers({ attach, detach }),
  lifecycle({
    componentDidMount,
    componentWillUnmount,
  })
)
