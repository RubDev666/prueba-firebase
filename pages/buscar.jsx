import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router';
import DetallesProducto from '@/components/layout/DetallesProducto';
import useProductos from '@/hooks/useProductos';
import firebase from '@/firebase';

const Buscar = () => {
    const router = useRouter();
    const { query: { q } } = router;

    const [productos, setProductos] = useState([]);

    //resultado de las busquedas
    const [resultado, guardarResultado] = useState([]);

    useEffect(() => {
        obtenerDatos();
    }, [])

    async function obtenerDatos() {
        let datos = [];

        //no se puede poner diretamente esta variable en un state... sea variable, objeto o lo que sea...
        //const res = await useProductos();
        
        const res = await firebase.getProductos();

        //iteramos y creamos una variable nueva...
        res.forEach(producto => datos.push(producto));

        //y todo para poder meterlo aqui...
        setProductos(datos);
    }

    useEffect(() => {
        //query es lo que esta en la url o lo que escribio el usuario en el input de busqueda

        const filtro = productos.filter(producto => {
            return (
                producto.producto.nombre.toLowerCase().includes(q) || producto.producto.descripcion.toLowerCase().includes(q)
            )
        });

        guardarResultado(filtro);
    }, [q, productos]);

    return (
        <>
            <Head>
                <title>Product Hunt | Buscador</title>
                <meta name="description" content="Pagina para buscar los productos" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Layout>
                <div className="listado-productos">
                    <div className="contenedor">
                        <ul className="bg-white">
                            {resultado.map(producto => (
                                <DetallesProducto
                                    key={producto.id}
                                    id={producto.id}
                                    producto={producto.producto}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Buscar;