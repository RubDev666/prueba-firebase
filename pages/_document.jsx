import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    
    //LAS HOJAS DE ESTILO EXTERNAS SE PONEN AQUI
    return (
        <Html lang="en">
            <Head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU=" crossOrigin="anonymous" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
