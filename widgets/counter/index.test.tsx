// import {
//   assert,
//   assertEquals,
//   assertExists,
//   assertStrictEquals,
//   assertThrows,
// } from "std/testing/asserts";
// import {
//   afterEach,
//   beforeEach,
//   describe,
//   it,
// } from "std/testing/bdd";
// import {
//   returnsNext,
//   stub,
// } from "std/testing/mock";
// import { configure, shallow } from 'enzyme';
// import { Adapter } from 'enzyme-adapter-preact-pure';
// import CounterWidget from './index.tsx'
// import Widget from "../../common/widget.tsx"
// import MessageBroker from "../../common/message-broker.ts";

// configure({ adapter: new Adapter() })

// describe('Counter widget', () => {

//   let messageBroker: MessageBroker
//   let counterWidget: Widget

//   beforeEach(() => {
//     messageBroker = new MessageBroker()
//     counterWidget = new CounterWidget(
//       'client',
//       messageBroker
//     )
//   })

//   describe('client widget', () => {
//     let clientWrapper: ShallowWrapper

//     beforeEach(() => {
//       const clientComponent = counterWidget.createClientWidget()
//       const clientWrapper = shallow(clientComponent);
//     })

//     it('should render the client widget', () => {
//       assert(
//         !!clientWrapper.find('.counter')
//       )
//       assert(
//         clientWrapper.find('.counter').length > 0
//       )
//     })
//   })
// })

