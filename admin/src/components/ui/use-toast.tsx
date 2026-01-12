import * as React from "react";

type Toast = {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactElement;
    variant?: 'default' | 'destructive'; 
    duration?: number;
};

type Action =
    | { type: "ADD_TOAST"; toast: Toast }
    | { type: "UPDATE_TOAST"; toast: Partial<Toast> }
    | { type: "DISMISS_TOAST"; toastId?: string }
    | { type: "REMOVE_TOAST"; toastId?: string };

interface State {
    toasts: Toast[];
}

const TOAST_LIMIT = 5;
const initialState: State = { toasts: [] };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };
   
        default:
            return state;
    }
};

const ToastContext = React.createContext<
    | ({ toast: (props: Omit<Toast, "id">) => { id: string } } & State)
    | undefined
>(undefined);

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToasterProvider");
    }
    return context;
}

export function ToasterProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    
    const addToast = React.useCallback(
        (toast: Toast) => {
            dispatch({ type: "ADD_TOAST", toast });
        },
        [dispatch]
    );

    const toast = React.useCallback(
        (props: Omit<Toast, "id">) => {
            const id = Date.now().toString(); 
            const newToast = { id, ...props };
            addToast(newToast);
            return { id };
        },
        [addToast]
    );

    return (
        <ToastContext.Provider value={{ ...state, toast }}>
            {children}
        </ToastContext.Provider>
    );
}

export type { Toast };