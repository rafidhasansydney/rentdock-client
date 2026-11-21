"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main" className="message-page"><span className="eyebrow dark">RENTDOCK</span><h1>Something went wrong.</h1><p>Please try again. Your connection may have been interrupted.</p><button className="button" onClick={reset}>Try again</button></main>;}
