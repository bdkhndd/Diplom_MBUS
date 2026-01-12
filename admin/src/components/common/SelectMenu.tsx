import React, { createContext, useContext, useState } from "react";

type Hicheel = {
    code: string;
    name: string;
    type: 'main' | 'secondary';
};

type MergejilPreviewForm = {
    mergejil_Ner: string;
    mergejil_Kod: string;
    tailbar: string;
    sudlah_kredit: number | string;
    suraltsah_hugatsaa: string;
    minScore: number | string;
    tenhimId: string;
    category: string; 
    hicheeluud: Hicheel[];
};

type UpdatePreviewContextType = {
    form: MergejilPreviewForm;
    setForm: React.Dispatch<React.SetStateAction<MergejilPreviewForm>>;
}

export const UpdatePreviewContext = createContext<UpdatePreviewContextType | null>(null);

export const UpdatePreviewProvider = ({ children }: { children: React.ReactNode }) => {
    const [form, setForm] = useState<MergejilPreviewForm>({
        mergejil_Ner: "",
        mergejil_Kod: "",
        tailbar: "",
        sudlah_kredit: "",
        suraltsah_hugatsaa: "",
        minScore: "",
        tenhimId: "",
        category: "", 
        hicheeluud: [], 
    });

    return (
        <UpdatePreviewContext.Provider value={{ form, setForm }}>
            {children}
        </UpdatePreviewContext.Provider>
    );
};

export const usePreviewUpdater = () => {
    const context = useContext(UpdatePreviewContext);
    if (!context) {
        throw new Error("usePreviewUpdater must be used within UpdatePreviewProvider");
    }
    return context;
};

export default UpdatePreviewProvider;