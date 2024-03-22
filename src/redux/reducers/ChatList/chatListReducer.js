
const initialState = {
  showAddUserModal: false,
  showOptionsModal: false,
  constainData: false,
  chatRoomList: [],
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
      case 'fetchChatListSuccess':
        return {
          ...state,
          chatRoomList: action.payload,
          constainData: true,
        };
    default:
      return state;
  }
};


export default chatListReducer;
