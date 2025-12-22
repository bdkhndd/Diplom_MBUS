import * as React from "react";

// Toast-ын төрлүүдийг тодорхойлно
type Toast = {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactElement;
    variant?: 'default' | 'destructive'; // Жишээ нь: default (ногоон/цэнхэр), destructive (улаан)
    duration?: number;
};

// Toast-ын action-ууд
type Action =
    | { type: "ADD_TOAST"; toast: Toast }
    | { type: "UPDATE_TOAST"; toast: Partial<Toast> }
    | { type: "DISMISS_TOAST"; toastId?: string }
    | { type: "REMOVE_TOAST"; toastId?: string };

// Toast-ын state
interface State {
    toasts: Toast[];
}

const TOAST_LIMIT = 5;
const initialState: State = { toasts: [] };

// Toast reducer
const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };
        // ... (бусад үйлдлүүд: UPDATE, DISMISS, REMOVE)
        default:
            return state;
    }
};

// 💡 Context-ийг үүсгэх
const ToastContext = React.createContext<
    | ({ toast: (props: Omit<Toast, "id">) => { id: string } } & State)
    | undefined
>(undefined);

// 💡 Custom hook: useToast
export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToasterProvider");
    }
    return context;
}

// 💡 Provider: ToasterProvider
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
            const id = Date.now().toString(); // Энгийн ID үүсгэх
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

// Та мөн Toast-ын type-ийг экспортолно
export type { Toast };