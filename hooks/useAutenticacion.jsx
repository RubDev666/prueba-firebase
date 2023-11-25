import { useEffect, useState } from 'react';

//esta parte no funciono desde el archivo "firebase" desde una clase
import { initializeApp } from 'firebase/app';
import firebaseConfig from '@/firebase/config';
import { getAuth, onAuthStateChanged } from "firebase/auth";

function useAutenticacion() {
    const [ usuarioAutenticado, guardarUsuarioAutenticado] = useState(null);

    useEffect(() => {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        const unsuscribe = onAuthStateChanged(auth, (user) => {
            if( user ) {
                guardarUsuarioAutenticado(user);
            } else {
                guardarUsuarioAutenticado(null);
            }
        })

        return () => unsuscribe();
    }, []);

    return usuarioAutenticado;
}

export default useAutenticacion;