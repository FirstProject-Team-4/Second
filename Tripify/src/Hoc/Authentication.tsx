
import { useAppContext } from "../Context/AppContext";
import { useEffect } from "react";

/**
 * Higher-order component for authentication.
 * 
 * @param prop - The component's props.
 * @returns The authenticated component.
 */
export default function Authentication(prop: any) {
    const { userData } = useAppContext();

    useEffect(() => {

    }, [userData]);

    return (
        <>
            {userData?.isAdmin && prop.children}
        </>
    );
}
