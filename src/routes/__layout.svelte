<script>
    import "../app.css";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import {
        currentUser,
        currentChain,
        currentChainID,
        nativeBalance,
        userBalances,
    } from "../lib/stores.js";
    import Header from "$lib/header.svelte";
    import Footer from "$lib/footer.svelte";
    import Seo from "$lib/seo.svelte";
    $: nativeBalance;
    $: userBalances;
    let isDarkmode;
    let moralisStarted = false; // track if started
    let chainsList = {
        "0x1": {
            id: "1",
            name: "eth",
            sym: "eth",
            logo: "eth.png",
            pool: "",
        },
        "0x38": {
            id: "56",
            name: "bsc",
            sym: "bnb",
            logo: "bsc.png",
            pool: "",
        },
        "0x89": {
            id: "137",
            name: "polygon",
            sym: "matic",
            logo: "polygon.png",
            pool: "",
        },
    };
    // Get user when moralisStarted changes
    $: if (moralisStarted) getCurrentUser();

    async function configureMoralis() {
        // Get Env variables
        const serverUrl = "https://giqbzxeo2t0n.usemoralis.com:2053/server";
        const appId = "nz6YueDoIjAB1ckXtXjxyP8PsmHWKPptYJl4ge0Z";
        // Start Moralis
        Moralis.start({ serverUrl, appId });
        await Moralis.initPlugins();
        await Moralis.enableWeb3();

        // Let the app know it's started
        moralisStarted = true;
    }

    // Check Moralis for current user
    async function getCurrentUser() {
        let user = Moralis.User.current();
        let chainId = await Moralis.chainId;
        // current user
        $currentUser = user;
        // current ChainID
        $currentChainID = chainId;
        $currentChain = chainsList[chainId].name;
        const balance = await Moralis.Web3API.account.getNativeBalance({
            chain: $currentChain,
        });
        let nb = await Moralis.Units.FromWei(balance.balance);
        $nativeBalance = parseFloat(nb);

        const balances = await Moralis.Web3API.account.getTokenBalances({
            chain: "bsc",
        });

        $userBalances = balances;
    }

    // Call configuration function when mounted
    onMount(() => {
        configureMoralis();
        isDarkmode = localStorage.getItem("isDarkmode");
        window.ethereum.on("networkChanged", function (networkId) {
            if (networkId == "1" || networkId == "56" || networkId == "137") {
                window.location = "/";
            }
        });
        /*if (typeof window.ethereum !== "undefined") {
            console.log("MetaMask is installed!");
        }*/
    });
</script>

<main
    class="flex flex-col w-full justify-between items-center min-h-screen bg-slate-100 dark:bg-slate-800 bg-[url('https://qwickswap.herokuapp.com/light@5fd90f0.png')] dark:bg-[url('https://qwickswap.herokuapp.com/dark_5fd90f0.png')]"
>
    <Header />
    {#if $page.url.pathname == "/"}
        {#if moralisStarted}
            <slot />
        {:else}
            <div class="relative flex-1 flex items-center justify-center h-max">
                <lottie-player
                    src="./bg-anim.json"
                    background="transparent"
                    class="absolute top-0 w-full h-full left-0 z-0 opacity-50 dark:opacity-80"
                    speed="0.3"
                    loop
                    autoplay
                />
                <Seo />
            </div>
        {/if}
    {:else}
        <slot />
    {/if}
    <Footer />
</main>

<style>
    main {
        background-repeat: no-repeat;
        background-size: 100vw;
    }
</style>
