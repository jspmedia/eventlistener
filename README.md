# EventListener
Quickly implement your own event listener in JavaScript.

## Getting started

Instantiate an EventListener object

```javascript
var eventListener = new EventListener();
```

Add an event listener callback

```javascript
var myCallback = function(param1, param2) {
  console.log(param1 + ", " + param2);
};

eventListener.add("some-event-type", myCallback);
```

Fire an event

```javascript
eventListener.fireEvent("some-event-type", ["Hello world!", 1]);
```
> Hello world!, 1

## Advanced usage

### Setting "this" object

Instantiate an EventListener object

```javascript
var eventListener = new EventListener();
```

Add an event listener callback with a specific "this" object

```javascript
var myOtherCallback = function(param1, param2) {
  console.log("My callback: " + param1 + ", " + param2 + ", " + this.foo);
};

eventListener.add("some-other-event-type", myOtherCallback, {foo: "bar"});
```

Fire an event

```javascript
eventListener.fireEvent("some-other-event-type", ["Hello world!", 1]);
```
> My callback: Hello world!, 1, bar

Overwrite "this" object on event fire

```javascript
eventListener.fireEvent("some-other-event-type", ["Hello world!", 2], {foo: "other"});
```
> My callback: Hello world!, 2, other

### (Retroactive) Firing all previous events when adding new callback

Add a new callback, but set retroactive to true

```javascript
// Create a new callback function
var myNewOtherCallback = function(param1, param2) {
  console.log("New callback: " + param1 + ", " + param2 + ", " + this.foo);
};

// Add callback function to event listener with retroactive so all previous events will fire this callback
eventListener.add("some-other-event-type", myNewOtherCallback, undefined, {retroactive: true});
```
> New callback: Hello world!, 1, undefined

> New callback: Hello world!, 2, other

All previous events immediately fired to catch this callback up

Fire a new event

```javascript
eventListener.fireEvent("some-other-event-type", ["Hello world!", 3]);
```
> My callback: Hello world!, 3, bar

> New callback: Hello world!, 3, undefined

### Adding listeners and removing them

Instantiate an EventListener object

```javascript
var eventListener = new EventListener();
```

Add event listeners callbacks with `id` properties

```javascript
var myCallback = function(nameOfListener) {
  return function(param1, param2) {
    console.log(nameOfListener + ":", param1 + ", " + param2);
  };
};

eventListener.add("some-event-type", myCallback("Listener 1"), undefined, {id: "my-listener-1"});
eventListener.add("some-event-type", myCallback("Listener 2"), undefined, {id: "my-listener-2"});
eventListener.add("some-event-type", myCallback("Listener 3"), undefined, {id: "my-listener-3"});
```

Fire an event

```javascript
eventListener.fireEvent("some-event-type", ["Hello world!", 1]);
```
> Listener 1: Hello world!, 1
> Listener 2: Hello world!, 1
> Listener 3: Hello world!, 1

Remove the second listener and fire another event

```javascript
eventListener.remove("some-event-type", "my-listener-2");

eventListener.fireEvent("some-event-type", ["Hello world!", 2]);
```
> Listener 1: Hello world!, 2
> Listener 3: Hello world!, 2
