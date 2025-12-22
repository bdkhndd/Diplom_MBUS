/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

/**
 * Hicheel: Gosa hicheelii meergajilaa
 */
type Hicheel = {
    code: string;
    name: string;
    type: 'main' | 'secondary';
};

/**
 * MergejilPreviewForm: Unka ulaagaalee meergajilaa
 */
type MergejilPreviewForm = {
    mergejil_Ner: string;
    mergejil_Kod: string;
    tailbar: string;
    sudlah_kredit: number | string;
    suraltsah_hugatsaa: string;
    minScore: number | string;
    tenhimId: string;
    category: string; // SelectMenu-n akka itti fayyadamuu danda'uuf dabalame
    hicheeluud: Hicheel[];
};

type UpdatePreviewContextType = {
    form: MergejilPreviewForm;
    setForm: React.Dispatch<React.SetStateAction<MergejilPreviewForm>>;
}

// Context uumuun (Context-iin uumuu)
export const UpdatePreviewContext = createContext<UpdatePreviewContextType | null>(null);

/**
 * UpdatePreviewProvider
 * Namoota gargaaruuf kan qophaa'e
 */
export const UpdatePreviewProvider = ({ children }: { children: React.ReactNode }) => {
    const [form, setForm] = useState<MergejilPreviewForm>({
        mergejil_Ner: "",
        mergejil_Kod: "",
        tailbar: "",
        sudlah_kredit: "",
        suraltsah_hugatsaa: "",
        minScore: "",
        tenhimId: "",
        category: "", // Initial state dabalameera
        hicheeluud: [], 
    });

    return (
        <UpdatePreviewContext.Provider value={{ form, setForm }}>
            {children}
        </UpdatePreviewContext.Provider>
    );
};

/**
 * usePreviewUpdater
 * Custom hook hojii kanaaf oolu
 */
export const usePreviewUpdater = () => {
    const context = useContext(UpdatePreviewContext);
    if (!context) {
        throw new Error("usePreviewUpdater must be used within UpdatePreviewProvider");
    }
    return context;
};

// Default export dabaluun dogoggora sana ni sirreessa
export default UpdatePreviewProvider;