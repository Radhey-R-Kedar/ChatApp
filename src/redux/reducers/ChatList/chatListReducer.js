
const initialState = {
  showAddUserModal: false,
  showOptionsModal: false,
  showQRCodeModal: false,
  constainData: false,
  chatRoomList: [],
  refreshing:false,
  chatroomAdd:false,
  isChatRoomSelected:false,
  selectedChatroom:null,
};

const chatListReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'toggleAddUserModal':
      return {
        ...state,
        showAddUserModal: !state.showAddUserModal,
      };

    case 'toggleOptionsModal':
      return {
        ...state,
        showOptionsModal: !state.showOptionsModal,
      };
    case 'toggleQRCodeModal':
      return {
        ...state,
        showQRCodeModal: !state.showQRCodeModal,
      };
    case 'toggleRefreshing':
      return {
        ...state,
        refreshing: !state.refreshing,
      };
    case 'toggleChatRoomAdd':
      return {
        ...state,
        chatroomAdd: !state.chatroomAdd,
      };
      case 'fetchChatListSuccess':
        return {
          ...state,
          chatRoomList: action.payload,
          constainData: true,
        };
      case 'setSelectedChatRoom':
        return {
          ...state,
          selectedChatroom: action.payload,
          isChatRoomSelected: action.selected,
        };
    default:
      return state;
  }
};


export default chatListReducer;
