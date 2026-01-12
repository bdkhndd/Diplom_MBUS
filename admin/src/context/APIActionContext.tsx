import React, { createContext, useContext, useReducer, type ReactNode } from "react";
import type { 
    HamtarsanHutType, 
    MergejilType, 
    TenhimType, 
    TetgelegType,
    TulburType,
    VideoType,
    ContactInfoType,
    FeedbackType
} from '../api/types'; 

type AppState = {
    tenhim: TenhimType[];
    mergejil: MergejilType[];
    hamtarsan_hut: HamtarsanHutType[];
    tetgeleg: TetgelegType[];
    tulbur: TulburType[];
    video: VideoType[];
    contactinfo: ContactInfoType[];
    feedback: FeedbackType[];
    loading: boolean;
    error: string | null;
};

type ActionType = 

    | { type: 'SET_TENHIM'; payload: TenhimType[] }
    | { type: 'ADD_TENHIM'; payload: TenhimType }
    | { type: 'UPDATE_TENHIM'; payload: TenhimType }
    | { type: 'DELETE_TENHIM'; payload: string }
    
    
    | { type: 'SET_MERGEJIL'; payload: MergejilType[] }
    | { type: 'ADD_MERGEJIL'; payload: MergejilType }
    | { type: 'UPDATE_MERGEJIL'; payload: MergejilType }
    | { type: 'DELETE_MERGEJIL'; payload: string }
    
    
    | { type: 'SET_HAMTARSAN_HUT'; payload: HamtarsanHutType[] }
    | { type: 'ADD_HAMTARSAN_HUT'; payload: HamtarsanHutType }
    | { type: 'UPDATE_HAMTARSAN_HUT'; payload: HamtarsanHutType }
    | { type: 'DELETE_HAMTARSAN_HUT'; payload: string }
    

    | { type: 'SET_TETGELEG'; payload: TetgelegType[] }
    | { type: 'ADD_TETGELEG'; payload: TetgelegType }
    | { type: 'UPDATE_TETGELEG'; payload: TetgelegType }
    | { type: 'DELETE_TETGELEG'; payload: string }
    

    | { type: 'SET_TULBUR'; payload: TulburType[] }
    | { type: 'ADD_TULBUR'; payload: TulburType }
    | { type: 'UPDATE_TULBUR'; payload: TulburType }
    | { type: 'DELETE_TULBUR'; payload: string }
    

    | { type: 'SET_VIDEO'; payload: VideoType[] }
    | { type: 'ADD_VIDEO'; payload: VideoType }
    | { type: 'UPDATE_VIDEO'; payload: VideoType }
    | { type: 'DELETE_VIDEO'; payload: string }
    

    | { type: 'SET_CONTACTINFO'; payload: ContactInfoType[] }
    | { type: 'ADD_CONTACTINFO'; payload: ContactInfoType }
    | { type: 'UPDATE_CONTACTINFO'; payload: ContactInfoType }
    | { type: 'DELETE_CONTACTINFO'; payload: string }
    
    
    | { type: 'SET_FEEDBACK'; payload: FeedbackType[] }
    | { type: 'ADD_FEEDBACK'; payload: FeedbackType }
    | { type: 'UPDATE_FEEDBACK'; payload: FeedbackType }
    | { type: 'DELETE_FEEDBACK'; payload: string }
    
    
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

const initialState: AppState = {
    tenhim: [],
    mergejil: [],
    hamtarsan_hut: [],
    tetgeleg: [],
    tulbur: [],
    video: [],
    contactinfo: [],
    feedback: [],
    loading: false,
    error: null,
};

const APIActionReducer = (state: AppState, action: ActionType): AppState => {
    switch (action.type) {
        // LOADING & ERROR
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };


        case 'SET_TENHIM':
            return { ...state, tenhim: action.payload };
        case 'ADD_TENHIM':
            return { ...state, tenhim: [action.payload, ...state.tenhim] };
        case 'UPDATE_TENHIM':
            return {
                ...state,
                tenhim: state.tenhim.map(item => item._id === action.payload._id ? action.payload : item),
            };
        case 'DELETE_TENHIM':
            return { ...state, tenhim: state.tenhim.filter(item => item._id !== action.payload) };

    
        case 'SET_MERGEJIL':
            return { ...state, mergejil: action.payload };
        case 'ADD_MERGEJIL':
            return { ...state, mergejil: [action.payload, ...state.mergejil] };
        case 'UPDATE_MERGEJIL':
            return {
                ...state,
                mergejil: state.mergejil.map(item => item._id === action.payload._id ? action.payload : item),
            };
        case 'DELETE_MERGEJIL':
            return { ...state, mergejil: state.mergejil.filter(item => item._id !== action.payload) };

     
        case 'SET_HAMTARSAN_HUT':
            return { ...state, hamtarsan_hut: action.payload };
        case 'ADD_HAMTARSAN_HUT':
            return { ...state, hamtarsan_hut: [action.payload, ...state.hamtarsan_hut] };
        case 'UPDATE_HAMTARSAN_HUT':
            return {
                ...state,
                hamtarsan_hut: state.hamtarsan_hut.map(item => item._id === action.payload._id ? action.payload : item),
            };
        case 'DELETE_HAMTARSAN_HUT':
            return { ...state, hamtarsan_hut: state.hamtarsan_hut.filter(item => item._id !== action.payload) };

       
        case 'SET_TETGELEG':
            return { ...state, tetgeleg: action.payload };
        case 'ADD_TETGELEG':
            return { ...state, tetgeleg: [action.payload, ...state.tetgeleg] };
        case 'UPDATE_TETGELEG':
            return {
                ...state,
                tetgeleg: state.tetgeleg.map(item => item._id === action.payload._id ? action.payload : item),
            };
        case 'DELETE_TETGELEG':
            return { ...state, tetgeleg: state.tetgeleg.filter(item => item._id !== action.payload) };

   
        case 'SET_TULBUR':
            return { ...state, tulbur: action.payload };
        case 'ADD_TULBUR':
            return { ...state, tulbur: [action.payload, ...state.tulbur] };
        case 'UPDATE_TULBUR':
            return {
                ...state,
                tulbur: state.tulbur.map(item => item._id === action.payload._id ? action.payload : item),
            };
        case 'DELETE_TULBUR':
            return { ...state, tulbur: state.tulbur.filter(item => item._id !== action.payload) };

      
        case 'SET_VIDEO':
            return { ...state, video: action.payload };
        case 'ADD_VIDEO':
            return { ...state, video: [action.payload, ...state.video] };
        case 'UPDATE_VIDEO':
            return {
                ...state,
                video: state.video.map(item => item._id === action.payload._id ? action.payload : item),
            };
        case 'DELETE_VIDEO':
            return { ...state, video: state.video.filter(item => item._id !== action.payload) };

       
        case 'SET_CONTACTINFO':
            return { ...state, contactinfo: action.payload };
        case 'ADD_CONTACTINFO':
            return { ...state, contactinfo: [action.payload, ...state.contactinfo] };
        case 'UPDATE_CONTACTINFO':
            return {
                ...state,
                contactinfo: state.contactinfo.map(item => item._id === action.payload._id ? action.payload : item),
            };
        case 'DELETE_CONTACTINFO':
            return { ...state, contactinfo: state.contactinfo.filter(item => item._id !== action.payload) };

  
        case 'SET_FEEDBACK':
            return { ...state, feedback: action.payload };
        case 'ADD_FEEDBACK':
            return { ...state, feedback: [action.payload, ...state.feedback] };
        case 'UPDATE_FEEDBACK':
            return {
                ...state,
                feedback: state.feedback.map(item => item._id === action.payload._id ? action.payload : item),
            };
        case 'DELETE_FEEDBACK':
            return { ...state, feedback: state.feedback.filter(item => item._id !== action.payload) };

        default:
            return state;
    }
};

interface APIActionContextType {
    state: AppState;
    dispatch: React.Dispatch<ActionType>;
}

const APIActionContext = createContext<APIActionContextType | undefined>(undefined);

export const APIActionContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(APIActionReducer, initialState);
    return (
        <APIActionContext.Provider value={{ state, dispatch }}>
            {children}
        </APIActionContext.Provider>
    );
};

export const useAPIActions = () => {
    const context = useContext(APIActionContext);
    if (context === undefined) {
        throw new Error('useAPIActions must be used within APIActionContextProvider');
    }
    return context;
};