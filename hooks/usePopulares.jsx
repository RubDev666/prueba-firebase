import { initializeApp } from 'firebase/app';
import firebaseConfig from '@/firebase/config';
import { getFirestore, collection, getDocs, orderBy, query, where } from 'firebase/firestore';

const usePopulares = async () => {
    //configuraciones para base de datos, y storage
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    //sin ordenar
    //const res = await getDocs(collection(db, "productos"));

    //para traer los datos ordenados
    //'creado' es la propiedad de referencia para ordenar
    //'desc', ordenar de forma inversa, para que el mas reciente creado, se muestre primero hasta arriba
    const q = query(collection(db, "productos"), orderBy('votos', 'desc'));
 
    const res = await getDocs(q);
 
    //este es el que viene en la documentacion
    /*querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });*/

    let productos = [];

    res.forEach(doc => productos = [...productos, { id: doc.id, producto: doc.data() }]);

    //filtrar solo los que tienen mas de 0 votos
    const conVotos = productos.filter((producto) => producto.producto.votos !== 0);

    return conVotos;
};

export default usePopulares;
