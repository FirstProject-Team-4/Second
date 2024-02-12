import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/config-firebase";



export const saveImage = async (file: File) => {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
}