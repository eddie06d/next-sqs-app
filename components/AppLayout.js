import Head from 'next/head'

export default function AppLayout(props) {
  return (
    <>
        <Head>
            <title>{ props.title }</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossOrigin="anonymous"/>
        </Head>
        <main className="w-4/5 mx-auto bg-slate-300 rounded-lg py-3 px-4 mt-5">
            { props.children }
        </main>
    </>
  )
}