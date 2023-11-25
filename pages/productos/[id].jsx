import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { FirebaseContext } from "@/firebase";
import Layout from "@/components/layout/Layout";
import Error404 from "@/components/layout/404";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Campo, InputSubmit } from "@/components/ui/Formulario";
import Boton from "@/components/ui/Boton";
import useProducto from "@/hooks/useProducto";
import firebase from "@/firebase";

const ContenedorProducto = styled.div`
   @media (min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
   }
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

//es mejor este, si uso un "Image" COMPONENT DE REAT, tnemos que configurarlo y darle estilos es mas complejo...
const Imagen = styled.img`
    width: auto;
`;

const Producto = () => {
    // state del componente
    const [producto, guardarProducto] = useState({});
    const [error, guardarError] = useState(false);
    const [comentario, guardarComentario] = useState({});
    const [consultarDB, guardarConsultarDB] = useState(true);

    //no uso state, por que no se actualiza bien y es mas complejo...
    let votoUsuarios;
 
    //extraer id del proudcto directo del link
    const router = useRouter();
    const { query: { id } } = useRouter();

    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {
        obtenerDatos(id);
    }, [id])

    //cargar los usuarios que han votoda en el producto
    useEffect(() => {
        votoUsuarios = producto.haVotado;
    }, [producto])

    const obtenerDatos = async (id) => {
        let dato;

        //no se puede poner diretamente esta variable en un state... sea variable, objeto o lo que sea...
        //const res = await useProducto(id);

        const res = await firebase.getProducto(id);

        //lo metemos en otra variable...
        if (res) {
            dato = res.producto;
        } else {
            guardarProducto({});

            guardarError(true);

            return
        }

        guardarError(false);

        //y todo para poder meterlo aqui...
        guardarProducto(dato);
    }

    //con eso se puede devolver un componente para la pagina de cargando
    if (Object.keys(producto).length === 0 && !error) return 'Cargando...';

    // función que revisa que el creador del producto sea el mismo que esta autenticado
    const puedeBorrar = () => {
        if (!usuario) return false;

        if (producto.creador.id === usuario.uid) {
            return true
        }
    }

    // elimina un producto de la bd
    const eliminarProducto = async () => {
        if (!usuario) {
            return router.push('/login')
        }

        if (producto.creador.id !== usuario.uid) {
            return router.push('/')
        }

        try {
            await firebase.borrarProducto(id);

            await firebase.borrarImg(producto.img.nombreImg);

            router.push('/')
        } catch (error) {
            console.log(error)
        }
    }

    // Funciones para crear comentarios
    const comentarioChange = e => {
        guardarComentario({
            ...comentario,
            [e.target.name]: e.target.value
        })
    }

    // Identifica si el comentario es del creador del producto
    const esCreador = id => {
        if (producto.creador.id == id) {
            return true;
        }
    }

    const agregarComentario = async e => {
        e.preventDefault();

        if (!usuario) {
            return router.push('/login')
        }

        // información extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        // Tomar copia de comentarios y agregarlos al arreglo
        const nuevosComentarios = [...producto.comentarios, comentario];

        await firebase.actualizarProducto(id, nuevosComentarios);

        // Actualizar el state
        guardarProducto({
            ...producto,
            comentarios: nuevosComentarios
        })

        //guardarConsultarDB(true); // hay un COMENTARIO, por lo tanto consultar a la BD
    }

    // Administrar y validar los votos
    const votarProducto = async () => {
        if (!usuario) {
            return router.push('/login')
        }

        // Verificar si el usuario actual ha votado
        let yaVoto;

        if(votoUsuarios.length > 0){
            for(let voto of votoUsuarios){
                if(voto === usuario.uid) {
                    yaVoto = true;
    
                    break;
                } else {
                    yaVoto = false;
                }
            }
        } else {
            yaVoto = false;
        }

        //si ya voto termina la funcion y no agrega nada
        if(yaVoto) return;

        // obtener y sumar un nuevo voto
        const nuevoTotal = producto.votos + 1;
        
        // guardar el ID del usuario que ha votado
        votoUsuarios.push(usuario.uid);

        const obj = {
            votos: nuevoTotal,
            haVotado: votoUsuarios
        }

        //guardamos los votos en la base de datos
        await firebase.votos(id, obj);

        // Actualizar el state
        guardarProducto({
            ...producto,
            votos: nuevoTotal
        })

        //guardarConsultarDB(true); // hay un voto, por lo tanto consultar a la BD*/
    }

    return (
        <>
            <Head>
                <title>Product Hunt | Productos</title>
                <meta name="description" content="Pagina principal" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Layout>
                {error ? <Error404 /> : (
                    <div className="contenedor">
                        <h1 css={css`
                            text-align: center;
                            margin-top: 5rem;
                        `}>
                            {producto.nombre}
                        </h1>

                        <ContenedorProducto>
                            <div>
                                <p>Publicado hace: {formatDistanceToNow(new Date(producto.creado), { locale: es })}</p>

                                <p>Por: {producto.creador.nombre} de {producto.empresa}</p>

                                <Imagen 
                                    src={producto.img.urlImg}
                                />

                                <p>{producto.descripcion}</p>

                                {usuario && (
                                    <>
                                        <h2>Agrega tu comentario</h2>
                                        <form
                                            onSubmit={agregarComentario}
                                        >
                                            <Campo>
                                                <input
                                                    type="text"
                                                    name="mensaje"
                                                    onChange={comentarioChange}
                                                />
                                            </Campo>
                                            <InputSubmit
                                                type="submit"
                                                value="Agregar Comentario"
                                            />
                                        </form>
                                    </>
                                )}

                                <h2 css={css`
                                    margin: 2rem 0;
                                `}>
                                    Comentarios
                                </h2>

                                {producto.comentarios.length === 0 ? "Aún no hay comentarios" : (
                                    <ul>
                                        {producto.comentarios.map((comentario, i) => (
                                            <li
                                                key={`${comentario.usuarioId}-${i}`}
                                                css={css`
                                                    border: 1px solid #e1e1e1;
                                                    padding: 2rem;
                                                `}
                                            >
                                                <p>{comentario.mensaje}</p>
                                                <p>Escrito por:
                                                    <span
                                                        css={css`
                                                            font-weight:bold;
                                                        `}
                                                    >
                                                        {''} {comentario.usuarioNombre}
                                                    </span>
                                                </p>
                                                {esCreador(comentario.usuarioId) && <CreadorProducto>Es Creador</CreadorProducto>}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <aside>
                                <Boton
                                    target="_blank"
                                    bgColor="true"
                                    href={producto.url}
                                >
                                    Visitar URL (no es link,es un btn)
                                </Boton>

                                <div
                                    css={css`
                                        margin-top: 5rem;
                                    `}
                                >
                                    <p css={css`
                                        text-align: center;
                                    `}>
                                        {producto.votos} Votos
                                    </p>

                                    {usuario && (
                                        <Boton
                                            onClick={votarProducto}
                                        >
                                            Votar
                                        </Boton>
                                    )}
                                </div>
                            </aside>
                        </ContenedorProducto>

                        {puedeBorrar() &&
                            <Boton
                                onClick={eliminarProducto}
                            >Eliminar Producto</Boton>
                        }
                    </div>
                )}
            </Layout>
        </>
    )
}

export default Producto;