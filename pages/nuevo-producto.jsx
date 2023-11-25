import React, { useState, useContext, useEffect } from 'react';
import Head from 'next/head';
import { css } from '@emotion/react';
import Router, { useRouter } from 'next/router';

import { initializeApp } from 'firebase/app';
import firebaseConfig from '@/firebase/config';
import { getFirestore, addDoc, collection } from 'firebase/firestore';

import Layout from '@/components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '@/components/ui/Formulario';
import { FirebaseContext } from '@/firebase';
import Error404 from '@/components/layout/404';


//validaciones
import useValidacion from '@/hooks/useValidacion';
import validarCrearProducto from '@/validacion/validarCrearProducto';

const STATE_INICIAL = {
    nombre: '',
    empresa: '',
    imagen: '',
    url: '',
    descripcion: ''
}
 
const NuevoProducto = () => {
    const [error, guardarError] = useState(false);

    const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

    const { nombre, empresa, imagen, url, descripcion } = valores;

    // hook de routing para redireccionar
    const router = useRouter();

    // context con las operaciones crud de firebase
    const { usuario, firebase } = useContext(FirebaseContext);


    async function crearProducto() {
        // si el usuario no esta autenticado llevar al login
        if (!usuario) {
            return router.push('/login');
        }

        //objeto con url y nombre de la imagen
        const img = await firebase.subirImg(imagen);

        // crear el objeto de nuevo producto 
        const producto = {
            nombre,
            empresa,
            url,
            img,
            descripcion,
            votos: 0,
            comentarios: [],
            creado: Date.now(),
            creador: {
                id: usuario.uid,
                nombre: usuario.displayName
            },
            haVotado: []
        }

        //configuraciones para base de datos, y storage
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // insertarlo en la base de datos
        await addDoc(collection(db, "productos"), producto);

        return router.push('/');
    }

    return (
        <>
            <Head>
                <title>Product Hunt | Crear producto</title>
                <meta name="description" content="Pagina para crear los productos" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Layout>
                {!usuario ? <Error404 /> : (
                    <>
                        <h1
                            css={css`
                                text-align: center;
                                margin-top: 5rem;
                            `}
                        >
                            Nuevo Producto
                        </h1>

                        <Formulario
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <fieldset>
                                <legend>Información General </legend>

                                <Campo>
                                    <label htmlFor="nombre">Nombre</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        placeholder="Nombre del Producto"
                                        name="nombre"
                                        value={nombre}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>
                                {errores.nombre && <Error>{errores.nombre}</Error>}

                                <Campo>
                                    <label htmlFor="empresa">Empresa</label>
                                    <input
                                        type="text"
                                        id="empresa"
                                        placeholder="Nombre Empresa o Compañia"
                                        name="empresa"
                                        value={empresa}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>
                                {errores.empresa && <Error>{errores.empresa}</Error>}

                                <Campo>
                                    <label htmlFor="imagen">Imagen</label>
                                    <input
                                        type="file"
                                        id='imagen'
                                        name='imagen'
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>

                                <Campo>
                                    <label htmlFor="url">URL</label>
                                    <input
                                        type="url"
                                        id="url"
                                        name="url"
                                        placeholder="URL de tu producto"
                                        value={url}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>
                                {errores.url && <Error>{errores.url}</Error>}
                            </fieldset>

                            <fieldset>
                                <legend>Sobre tu Producto</legend>

                                <Campo>
                                    <label htmlFor="descripcion">Descripcion</label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        value={descripcion}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>
                                {errores.descripcion && <Error>{errores.descripcion}</Error>}
                            </fieldset>

                            {error && <Error>{error} </Error>}

                            <InputSubmit
                                type="submit"
                                value="Crear Producto"
                            />
                        </Formulario>
                    </>
                )}
            </Layout>
        </>
    )
}

export default NuevoProducto;
