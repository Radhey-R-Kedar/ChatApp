const initialState ={
    isOnline : false,
}


const userInformationReducer =(state = initialState, action)=>{
    switch(action.type){
        case "setOnlineStatus":
            return{
                ...state,
                isOnline : action.payload,
            }
        default: return state;
            
    }
}

export default userInformationReducer;