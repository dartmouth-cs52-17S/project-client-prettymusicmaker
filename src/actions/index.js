// import axios from 'axios';

// keys for action types
 export const ActionTypes = {
   ADD_MUSIC_NOTE: 'ADD_MUSIC_NOTE',
 };

 // dispatch action with a column id, and the clicked note array
 export function addNote(data) {
   return (dispatch) => {
     dispatch({ type: ActionTypes.ADD_MUSIC_NOTE });
   };
 }
