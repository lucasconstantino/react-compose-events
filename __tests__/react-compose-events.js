import React from 'react'
import Emitter from 'component-emitter'
import { mount } from 'enzyme'
import { withEvents } from '../src/react-compose-events'
import { compose, withState, withHandlers } from 'recompose'

describe('withEvents', () => {
  const TextComponent = () => <p>Listening to scroll!</p>

  it('should call handler on event trigger', () => {
    const handler = jest.fn()
    const target = new Emitter()
    const connect = withEvents(target, { 'custom': handler })
    const ConnectedComponent = connect(TextComponent)

    mount(<ConnectedComponent />)

    expect(handler).not.toHaveBeenCalled()
    target.emit('custom')
    expect(handler).toHaveBeenCalled()
  })

  it('should accept target as function', () => {
    const handler = jest.fn()
    const target = new Emitter()
    const connect = withEvents(() => target, { 'custom': handler })
    const ConnectedComponent = connect(TextComponent)

    mount(<ConnectedComponent />)

    expect(handler).not.toHaveBeenCalled()
    target.emit('custom')
    expect(handler).toHaveBeenCalled()
  })

  it('should accept event map as function', () => {
    const handler = jest.fn()
    const target = new Emitter()
    const connect = withEvents(target, () => ({ 'custom': handler }))
    const ConnectedComponent = connect(TextComponent)

    mount(<ConnectedComponent />)

    expect(handler).not.toHaveBeenCalled()
    target.emit('custom')
    expect(handler).toHaveBeenCalled()
  })

  describe.only('real world', () => {
    const CallsComponent = ({ calls }) => <p>calls: { calls }</p>

    it('should compose well with recompose', () => {
      const target = new Emitter()
      const connect = compose(
        withState('calls', 'setCalls', 0),
        withHandlers({
          increaseCalls: ({ calls, setCalls }) => e => setCalls(calls + 1)
        }),
        withEvents(target, ({ increaseCalls }) => ({
          'custom': increaseCalls
        }))
      )

      const ConnectedComponent = connect(CallsComponent)
      const MountedComponent = mount(<ConnectedComponent />)

      expect(MountedComponent.text()).toContain('calls: 0')
      target.emit('custom')
      expect(MountedComponent.text()).toContain('calls: 1')
    })

    it.only('should detach on dynamic prop removal', () => {
      const handler = jest.fn()
      const target = new Emitter()
      const connect = withEvents(target, ({ add }) => add
        ? { 'custom': handler }
        : undefined
      )

      const ConnectedComponent = connect(TextComponent)
      const MountedComponent = mount(<ConnectedComponent />)

      expect(handler).not.toHaveBeenCalled()
      target.emit('custom')
      expect(handler).not.toHaveBeenCalled()

      MountedComponent.setProps({ add: true })
      target.emit('custom')
      expect(handler).toHaveBeenCalledTimes(1)

      MountedComponent.setProps({ add: false })
      target.emit('custom')
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })
})
