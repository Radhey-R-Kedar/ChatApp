// Define initial state
const initialState = {};

// Reducer function
const chatRoomsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'setMessages':
      return {
        ...state,
        [action.payload.roomId]: action.payload.messages,
      };
    case 'addMessage':
      const {roomId, message} = action.payload;
      return {
        ...state,
        [roomId]: [...(state[roomId] || []), message],
      };
    case 'setNewMessages':
      return {
        ...state,
        [`newMsgArr_${action.payload.roomId}`]: action.payload.messages,
      };

    default:
      return state;
  }
};

export default chatRoomsReducer;

// dispatch({
//   type: 'setMessages',
//   payload: { roomId: 'roomId1', messages: [/* array of messages */] },
// });

// dispatch({
//   type: 'addMessage',
//   payload: { roomId: 'roomId1', message: {/* new message object */} },
// });
