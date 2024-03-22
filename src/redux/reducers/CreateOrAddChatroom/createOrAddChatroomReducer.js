const initialState = {
  createNew: false,
  id: '',
  profilePicId: 1,
  name: '',
  status:''
};

const createOrAddChatroomReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'toogleCreateNew':
      return {
        ...state,
        createNew: !state.createNew,
      };
    case 'setId':
      return {
        ...state,
        id: action.payload,
      };
    case 'setProfilePicId':
      return {
        ...state,
        profilePicId: action.payload,
      };
    case 'setName':
      return {
        ...state,
        name: action.payload,
      };
    case 'setStatus':
      return {
        ...state,
        status: action.payload,
      };
    default:
      return state;
  }
};

export default createOrAddChatroomReducer;
