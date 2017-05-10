# React Compose Events [![Build Status](https://travis-ci.org/lucasconstantino/react-compose-events.svg?branch=master)](https://travis-ci.org/lucasconstantino/react-compose-events)

> A Higher-Order Component factory to attach outside event listeners

## Why?

It is not that common nowadays, but sometimes, when developing for the web, we still need to rely on events that happen on objects out of React application scope; window events, for instance. There are a couple of solutions out there - the most prominent probably being [react-event-listener](https://github.com/oliviertassinari/react-event-listener) - but none solved this problem in a way such that it would be easy to use with composition libraries such as [recompose](https://github.com/acdlite/recompose). *react-compose-events* does that.

## Install

`yarn add react-compose-events`

> Or, good ol' `npm install --save react-compose-events`

## Usage

### Simple as can

```js
import { withEvents } from 'react-compose-events'

const MyScrollListeningComponent = () => (
  <p>
    Look at your console!
  </p>
)

export default withEvents(window, {
  scroll: () => console.log('scrolling!')
})(MyScrollListeningComponent)
```

### With recompose friends

Usually you'll need events to fire in a global object, but have them affect the props used on the components. Here goes some example using recompose tools.

```js
import { compose, withState, withHandlers } from 'recompose'
import { withEvents } from 'react-compose-events'

const MyScrollListeningComponent = ({ scrollTop }) => (
  <p>
    Look! Scroll is at { scrollTop }
  </p>
)

export default compose(
  withState('scrollTop', 'setScrollTop', 0),
  withHandlers({
    scroll: ({ setScrollTop }) => e => setScrollTop(window.scrollY)
  }),
  withEvents(window, ({ scroll }) => ({ scroll })),
)(MyScrollListeningComponent)
```

Notice here that the second argument of `withEvents` can be either an object mapping event names to handlers, or a function, which will be called with the piping props and should return the map of events. This way you can have event handlers based on passed props - such as handlers created via `withHandlers`, as the example shows.

## Warnings

### Server-side rendering

On SSR you might run into trouble when trying to access global objects such as `window`, which will probably not be availble. For these cases, the first argument of `withEvents` can also be passed a function, which will be called only when attaching the event listeners, during `componentDidMount`.

### Function implementations as target

If the provided target both is an implementation of the `EventTarget` interface and has a `typeof` of `function`, it will be executed when resolving the target, which might not be intended. To avoid that, you might want to provided the target as a simple function returning the real target.

## License

Copyright (c) 2017 Lucas Constantino Silva

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
