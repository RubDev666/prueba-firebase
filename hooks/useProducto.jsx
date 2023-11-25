import { initializeApp } from 'firebase/app';
import firebaseConfig from '@/firebase/config';
import { getFirestore, collection, getDocs, orderBy, query, where, getDoc, doc } from 'firebase/firestore';

const useProducto = async (id) => {
    //configuraciones para base de datos, y storage
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    //sin ordenar
    //const res = await getDocs(collection(db, "productos"));

    //para traer los datos ordenados
    //'creado' es la propiedad de referencia para ordenar
    //'desc', ordenar de forma inversa, para que el mas reciente creado, se muestre primero hasta arriba
    const q = query(collection(db, "productos"));
 
    const res = await getDocs(q);

    //este es el que viene en la documentacion
    /*querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });*/

    let producto;

    //extraer el producto nada mas
    res.forEach(doc => {
        if(doc.id === id) {
            producto = { id: doc.id, producto: doc.data() }
        }
    });

    //esta es la forma correcta, pero es mas lenta y no me gusta...
    /*try {
        //codigo para extraer por id directamente
        const product = await getDoc( doc(db, "productos", id) );

        if(product.exists()) {
            let res = product.data();

            producto = res;
        }else{
            console.log('El producto no existe')
        }
    } catch (error) {
        
    }*/

    return producto;
};

export default useProducto;
