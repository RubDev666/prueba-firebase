import '@/styles/app.css'; //estilos globales

import firebase, {FirebaseContext} from '@/firebase';
import useAutenticacion from '@/hooks/useAutenticacion';

export default function App({ Component, pageProps }) {
    const usuario = useAutenticacion();

    return (
        <FirebaseContext.Provider
            value={{firebase, usuario}}
        >
            <Component {...pageProps} />
        </FirebaseContext.Provider>
    )
}
