import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMoralis } from "react-moralis";



export default function Home() {
  const { authenticate, isAuthenticated, logout } = useMoralis();
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated]);
  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <Head>
        <title>NFT Minter</title>
        <link rel="icon" href="/favicon.ico" />

      </Head>

      <img src='/images/logo.png' className="w-40 h-40 img" />

      <h1 className="title">NftMinter</h1>

      <button
        onClick={authenticate}
        className="prova"
      >
        Login MetaMask
      </button>



    </div>
  );
  //coao
}