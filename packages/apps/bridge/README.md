# zeroBridge

zeroDAO enabled BTC bridging, built from create-react-app

Should serve as a reference implementation for building zeroDAO applications, for developers

# Installation

```shell
yarn
```

## Test

The following script will start the application in development mode, with the zeroDAO SDK mock environment running. You should change your MetaMask target to localhost:8545 to begin testing

```shell

yarn start:dev

```

## Author

zeroDAO community

## Core Documentation

**_file structure_**

- UI
  - atomic design
    -atoms include buttons, indicators, spinner, status, titles
    -molecules include compositional elements for organisms, including complex input fields, module based loaders, event based cards etc.
    -organisms are top level components to be composed into a layout
    -layouts are structural scaffolding level to compose pages
    -pages are top level components
- API

  - global state,
    global state is composed of a reducer that holds all state objects,
    a reducer with capabilities to update individual properties of a state object or batch properties on a state object,
    as well as trigger loading states to be resolved via an effect composed of a succeed_request dispatch or a fail_request dispatch

  - interfaces inject global statefullness to components as well as exposing state updating via pre-declared functions for simplicity

  - (storage)
    for storage we will utilize indexeddb as a structured object store. declerations for indexed db are located in ./src/api and should be utilized via useEffect hook within the globalContext <provider>
    transfer/release objects should be stored only if mint.on('deposit') event is recieved

  - (events)
    event groups should have their own emitter and should be controlled via a EventManager Hook in a top level component or wrapper. events should interface with a jsx component capable of drawing event card such as error cards
    or transfer request status cards to the screen as well as exposing timed functions to optionally close those modals as well as a manual user interactable close function

  - (history)
    to be designed

## Component Documenation

**_file structure_**

- UI
  - atoms
  - molecules
  - organisms
  - layouts
  - pages
- API
  - event
  - global
  - storage
  - utils
