import {combineReducers} from 'redux';
import chatListReducer from './ChatList/chatListReducer';
import createOrAddChatroomReducer from './CreateOrAddChatroom/createOrAddChatroomReducer';

const rootReducer = combineReducers({
  chatlist: chatListReducer,
  chatroom: createOrAddChatroomReducer,
});

export default rootReducer;
