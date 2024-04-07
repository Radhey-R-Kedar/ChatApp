// Define initial state
const initialState = {
  lastMessageTimestamps: {} // { roomId: timestamp }
};

// Reducer function
const chatRoomsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'setMessages':
      return {
        ...state,
        [action.payload.roomId]: action.payload.messages,
        lastMessageTimestamps: {
          ...state.lastMessageTimestamps,
          [`timestamp_${action.payload.roomId}`]: action.payload.messages.length > 0 ? action.payload.messages[action.payload.messages.length - 1].timestamp : null
        }
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
