import {combineReducers} from 'redux';
import chatListReducer from './ChatList/chatListReducer';
import createOrAddChatroomReducer from './CreateOrAddChatroom/createOrAddChatroomReducer';
import chatsDataReducer from './ChatsData/chatsDataReducer';
import userInformationReducer from './UserInformation/userInformationReducer';

const rootReducer = combineReducers({
  chatlist: chatListReducer,
  chatroom: createOrAddChatroomReducer,
  chatdata: chatsDataReducer,
  userinfo: userInformationReducer,
});

export default rootReducer;
