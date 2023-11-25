import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import DetallesProducto from '@/components/layout/DetallesProducto';
import useProductos from '@/hooks/useProductos';
import firebase from '@/firebase';

export default function Home() {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        obtenerDatos();
    }, [])

    const obtenerDatos = async () => {
        try {
            let datos = [];

            //no se puede poner diretamente esta variable en un state... sea variable, objeto o lo que sea...
            //const res = await useProductos();
    
            const res = await firebase.getProductos();
    
            //iteramos y creamos una variable nueva...
            res.forEach(producto => datos.push(producto));
    
            //y todo para poder meterlo aqui...
            setProductos(datos);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Head>
                <title>Product Hunt | Inicio</title>
                <meta name="description" content="Pagina principal" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Layout>
                <div className="listado-productos">
                    <div className="contenedor">
                        <ul className="bg-white">
                            {productos.map(producto => (
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
};
